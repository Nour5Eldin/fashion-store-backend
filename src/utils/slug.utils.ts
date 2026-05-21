export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")   // Remove special chars except - and spaces
    .replace(/[\s_]+/g, "-")    // Spaces and underscores → hyphens
    .replace(/-+/g, "-")        // Multiple hyphens → single hyphen
    .replace(/^-+|-+$/g, "");   // Trim hyphens from start/end
};
export const makeUniqueSlug = (baseSlug: string): string => {
  const suffix = Math.random().toString(36).substring(2, 6); 
  return `${baseSlug}-${suffix}`;
};