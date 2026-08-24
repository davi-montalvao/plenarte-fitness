export const NAME_HINT = "Informe nome e sobrenome.";

export function getNameError(name: string): string | null {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) {
    return "Informe nome e sobrenome";
  }
  return null;
}
