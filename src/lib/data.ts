import { prisma } from "./prisma";

export async function getTeamMembers() {
  try {
    return await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        role: true,
        image: true,
        instagram: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    return [];
  }
}

export async function getTestimonials() {
  try {
    return await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        designation: true,
        content: true,
        image: true,
        star: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return [];
  }
}

export async function getInvestmentOptions() {
  try {
    return await prisma.investmentOption.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        image: true,
        minInvestment: true,
        description: true,
        link: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch investment options:", error);
    return [];
  }
}
