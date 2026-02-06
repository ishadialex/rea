"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { UserProfile, UpdateProfileRequest, ApiResponse } from "@/types/user";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSuccess: (updatedProfile: UserProfile) => void;
}

const EditProfileModal = ({ isOpen, onClose, profile, onSuccess }: EditProfileModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
    dateOfBirth: profile.dateOfBirth,
    nationality: profile.nationality,
    address: profile.address,
    city: profile.city,
    state: profile.state,
    postalCode: profile.postalCode,
    country: profile.country,
    profilePhoto: profile.profilePhoto,
    bio: profile.bio,
    occupation: profile.occupation,
  });

  // Reset form when profile changes
  useEffect(() => {
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      dateOfBirth: profile.dateOfBirth,
      nationality: profile.nationality,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      postalCode: profile.postalCode,
      country: profile.country,
      profilePhoto: profile.profilePhoto,
      bio: profile.bio,
      occupation: profile.occupation,
    });
    setErrorMessage("");
    setFieldErrors({});
  }, [profile, isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Close when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleInputChange = (field: keyof UpdateProfileRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      setErrorMessage("");

      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/profile/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const result: ApiResponse<{ url: string }> = await response.json();

      if (result.success && result.data) {
        setFormData((prev) => ({ ...prev, profilePhoto: result.data!.url }));
      } else {
        setErrorMessage(result.message || "Failed to upload photo");
      }
    } catch (error) {
      setErrorMessage("Failed to upload photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, profilePhoto: null }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName?.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!formData.phone?.trim()) {
      errors.phone = "Phone number is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSaving(true);
      setErrorMessage("");

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse<UserProfile> = await response.json();

      if (result.success && result.data) {
        // Update localStorage for ProfileDropdown
        if (formData.firstName) {
          localStorage.setItem("userName", `${formData.firstName} ${formData.lastName}`);
        }
        onSuccess(result.data);
      } else {
        if (result.errors) {
          setFieldErrors(result.errors);
        }
        setErrorMessage(result.message || "Failed to update profile");
      }
    } catch (error) {
      setErrorMessage("Failed to connect to server");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="max-h-[95vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl dark:bg-gray-dark sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-dark sm:px-6 sm:py-4">
          <h2 className="text-lg font-bold text-black dark:text-white sm:text-xl">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 sm:h-10 sm:w-10"
          >
            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mx-4 mt-3 flex items-center gap-2 rounded-lg bg-red-50 p-3 dark:bg-red-900/20 sm:mx-6 sm:mt-4 sm:gap-3 sm:p-4">
            <svg className="h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs font-medium text-red-800 dark:text-red-300 sm:text-sm">{errorMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          {/* Profile Photo */}
          <div className="mb-5 flex flex-col items-center gap-3 sm:mb-6 sm:flex-row sm:gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800 sm:h-20 sm:w-20">
                {formData.profilePhoto ? (
                  <Image
                    src={formData.profilePhoto}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-primary sm:text-2xl">
                    {formData.firstName?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
              {isUploadingPhoto && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent sm:h-6 sm:w-6"></div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={handlePhotoClick}
                disabled={isUploadingPhoto}
                className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-black transition-colors hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 sm:text-sm"
              >
                Change Photo
              </button>
              {formData.profilePhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 sm:text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Name Fields */}
          <div className="mb-3 grid gap-3 sm:mb-4 sm:grid-cols-2 sm:gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-black dark:text-white sm:mb-2 sm:text-sm">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-black outline-none transition-colors focus:border-primary dark:bg-gray-800 dark:text-white sm:px-4 sm:py-3 ${
                  fieldErrors.firstName ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                }`}
                placeholder="John"
              />
              {fieldErrors.firstName && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.firstName}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-black dark:text-white sm:mb-2 sm:text-sm">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-black outline-none transition-colors focus:border-primary dark:bg-gray-800 dark:text-white sm:px-4 sm:py-3 ${
                  fieldErrors.lastName ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                }`}
                placeholder="Doe"
              />
              {fieldErrors.lastName && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.lastName}</p>
              )}
            </div>
          </div>

          {/* Phone & DOB */}
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-black outline-none transition-colors focus:border-primary dark:bg-gray-800 dark:text-white ${
                  fieldErrors.phone ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                }`}
                placeholder="+1 (555) 123-4567"
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none transition-colors focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Nationality & Occupation */}
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                Nationality
              </label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => handleInputChange("nationality", e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none transition-colors focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="United States"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
                Occupation
              </label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => handleInputChange("occupation", e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none transition-colors focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="Investment Manager"
              />
            </div>
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
              Street Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none transition-colors focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="123 Main Street, Suite 100"
            />
          </div>

          {/* City, State, Postal */}
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="mb-1.5 block text-xs font-semibold text-black dark:text-white sm:mb-2 sm:text-sm">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-black outline-none transition-colors focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:px-4 sm:py-3"
                placeholder="New York"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-black dark:text-white sm:mb-2 sm:text-sm">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-black outline-none transition-colors focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:px-4 sm:py-3"
                placeholder="NY"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-black dark:text-white sm:mb-2 sm:text-sm">
                Postal Code
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => handleInputChange("postalCode", e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-black outline-none transition-colors focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:px-4 sm:py-3"
                placeholder="10001"
              />
            </div>
          </div>

          {/* Country */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
              Country
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none transition-colors focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="USA"
            />
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-black dark:text-white">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-black outline-none transition-colors focus:border-primary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Tell us a little about yourself..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 font-semibold text-black transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
