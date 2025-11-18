/**
 * Generate avatar URL from UI Avatars service
 */
export function generateAvatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=200`;
}

/**
 * Get valid image source with fallback to generated avatar
 */
export function getValidImageSrc(avatar: string | null | undefined, name: string): string {
  if (!avatar || avatar === "null" || avatar === "undefined" || avatar.trim() === "") {
    return generateAvatarUrl(name || "User");
  }

  if (avatar.startsWith("http") || avatar.startsWith("/uploads/")) {
    return avatar;
  }

  if (avatar.includes("ui-avatars.com")) {
    return avatar;
  }

  return generateAvatarUrl(name || "User");
}

/**
 * Validate image file type and size
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Please select a valid image file (JPEG, PNG, or WebP)",
    };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "Image size must be less than 5MB",
    };
  }

  return { valid: true };
}

/**
 * Convert file to base64 for preview
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Upload avatar image to server
 */
export async function uploadAvatar(file: File): Promise<{ url: string; error?: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/upload-avatar", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const data = await response.json();

  if (response.ok) {
    return { url: data.url };
  } else {
    return { url: "", error: data.error || "Failed to upload image. Please try again." };
  }
}

/**
 * Delete avatar image from server
 */
export async function deleteAvatar(): Promise<{ success: boolean; error?: string }> {
  const response = await fetch("/api/delete-avatar", {
    method: "DELETE",
    credentials: "include",
  });

  if (response.ok) {
    return { success: true };
  } else {
    const data = await response.json();
    return {
      success: false,
      error: data.error || "Failed to delete avatar. Please try again.",
    };
  }
}
