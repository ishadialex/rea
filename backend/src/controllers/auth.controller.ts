import { Request, Response } from "express";
import crypto from "node:crypto";
import { prisma } from "../config/database.js";
import { success, error } from "../utils/response.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { generateOtp, createOtp, verifyOtpCode } from "../utils/otp.js";
import { sendOtpEmail } from "../services/email.service.js";

function generateReferralCode(): string {
  return crypto.randomBytes(4).toString("hex"); // 8 hex chars
}

function parseUserAgent(ua: string | undefined): { device: string; browser: string } {
  if (!ua) return { device: "Unknown", browser: "Unknown" };

  let browser = "Unknown";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";

  let device = "Desktop";
  if (ua.includes("Mobile")) device = "Mobile";
  else if (ua.includes("Tablet")) device = "Tablet";

  return { device, browser };
}

export async function register(req: Request, res: Response) {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return error(res, "An account with this email already exists", 409);
    }

    const passwordHash = await hashPassword(password);
    const referralCode = generateReferralCode();

    // Create user with emailVerified: false (will be set to true after OTP verification)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        referralCode,
        emailVerified: false, // Explicitly set to false
        settings: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        referralCode: true,
        createdAt: true,
      },
    });

    // Generate 6-digit OTP
    const otpCode = generateOtp();

    // Store OTP in database with 10-minute expiry
    await createOtp(email, otpCode);

    // Send OTP via email
    try {
      await sendOtpEmail(email, otpCode, firstName);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      // User is created, they can request resend later
    }

    // Return success WITHOUT tokens (user must verify email first)
    return success(
      res,
      {
        email: user.email,
        message: "Please check your email for the verification code",
      },
      "Registration successful. Please check your email for the verification code.",
      201
    );
  } catch (err) {
    console.error("register error:", err);
    return error(res, "Registration failed", 500);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        passwordHash: true,
        isActive: true,
        emailVerified: true,
      },
    });

    if (!user || !user.isActive) {
      return error(res, "Invalid email or password", 401);
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      return error(res, "Invalid email or password", 401);
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return error(res, "Please verify your email before logging in. Check your inbox for the verification code.", 403);
    }

    const { device, browser } = parseUserAgent(req.headers["user-agent"]);

    const accessToken = signAccessToken({ userId: user.id, email: user.email });
    const refreshToken = signRefreshToken({ userId: user.id, email: user.email });

    await prisma.session.create({
      data: {
        userId: user.id,
        token: refreshToken,
        device,
        browser,
        ipAddress: req.ip || "",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const { passwordHash: _, ...userData } = user;

    return success(res, {
      user: userData,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("login error:", err);
    return error(res, "Login failed", 500);
  }
}

export async function verifyOtp(req: Request, res: Response) {
  try {
    const { email, code } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        emailVerified: true,
        phone: true,
        referralCode: true,
      },
    });

    if (!user) {
      return error(res, "User not found", 404);
    }

    // Check if already verified
    if (user.emailVerified) {
      return error(res, "Email is already verified. Please login.", 400);
    }

    // Verify OTP code
    const verification = await verifyOtpCode(email, code);

    if (!verification.success) {
      return error(res, verification.message, 400);
    }

    // Mark email as verified
    await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });

    // Parse user agent for session tracking
    const { device, browser } = parseUserAgent(req.headers["user-agent"]);

    // Generate tokens
    const accessToken = signAccessToken({ userId: user.id, email: user.email });
    const refreshToken = signRefreshToken({ userId: user.id, email: user.email });

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: refreshToken,
        device,
        browser,
        ipAddress: req.ip || "",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Return user data with tokens
    return success(res, {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        referralCode: user.referralCode,
        emailVerified: true,
      },
      accessToken,
      refreshToken,
    }, "Email verified successfully");
  } catch (err) {
    console.error("verifyOtp error:", err);
    return error(res, "OTP verification failed", 500);
  }
}

export async function resendOtp(req: Request, res: Response) {
  try {
    const { email } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        emailVerified: true,
      },
    });

    if (!user) {
      // Return generic success to avoid email enumeration
      return success(res, null, "If an account exists with this email, a new verification code has been sent.");
    }

    // Check if already verified
    if (user.emailVerified) {
      return error(res, "Email is already verified. Please login.", 400);
    }

    // Generate new OTP
    const otpCode = generateOtp();

    // Store new OTP (this will delete old ones)
    await createOtp(email, otpCode);

    // Send OTP via email
    try {
      await sendOtpEmail(email, otpCode, user.firstName);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      return error(res, "Failed to send verification email. Please try again.", 500);
    }

    return success(res, null, "A new verification code has been sent to your email.");
  } catch (err) {
    console.error("resendOtp error:", err);
    return error(res, "Failed to resend verification code", 500);
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    // Placeholder: always return success to avoid email enumeration
    return success(res, null, "If that email exists, a reset link has been sent");
  } catch (err) {
    console.error("forgotPassword error:", err);
    return error(res, "Request failed", 500);
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    // Placeholder: return success
    return success(res, null, "Password has been reset successfully");
  } catch (err) {
    console.error("resetPassword error:", err);
    return error(res, "Password reset failed", 500);
  }
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return error(res, "Refresh token is required", 400);
    }

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      return error(res, "Invalid or expired refresh token", 401);
    }

    const session = await prisma.session.findUnique({
      where: { token },
    });

    if (!session || !session.isActive) {
      return error(res, "Session not found or has been revoked", 401);
    }

    const newAccessToken = signAccessToken({
      userId: payload.userId,
      email: payload.email,
    });
    const newRefreshToken = signRefreshToken({
      userId: payload.userId,
      email: payload.email,
    });

    await prisma.session.update({
      where: { id: session.id },
      data: {
        token: newRefreshToken,
        lastActive: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return success(res, {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error("refreshToken error:", err);
    return error(res, "Token refresh failed", 500);
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return error(res, "Refresh token is required", 400);
    }

    const session = await prisma.session.findUnique({
      where: { token },
    });

    if (session) {
      await prisma.session.update({
        where: { id: session.id },
        data: { isActive: false },
      });
    }

    return success(res, null, "Logged out successfully");
  } catch (err) {
    console.error("logout error:", err);
    return error(res, "Logout failed", 500);
  }
}
