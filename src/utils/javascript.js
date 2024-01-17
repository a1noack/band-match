import { ACCEPTED_IMAGE_TYPES } from "./constant";

export const validateImageType = (
  file,
  allowedFormats = ACCEPTED_IMAGE_TYPES
) => {
  const allowedExtensions = allowedFormats
    .split(",")
    .map((extension) => extension.trim().toLowerCase().replace(".", ""));

  const fileExtension = file.name.split(".").pop().toLowerCase();
  return (
    allowedExtensions.includes("*") ||
    allowedExtensions.some((ext) => fileExtension.endsWith(ext))
  );
};
