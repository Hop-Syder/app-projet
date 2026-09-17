/**
 * Génère un slug URL-friendly à partir d'une chaîne de caractères
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with dashes
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
}

/**
 * Génère un slug unique en ajoutant un suffixe si nécessaire
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}
