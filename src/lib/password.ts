export const PASSWORD_HINT =
  "Mínimo 6 caracteres, com letra maiúscula, número e caractere especial (!@#$...).";

export function getPasswordError(password: string): string | null {
  if (password.length < 6) {
    return "A senha precisa ter no mínimo 6 caracteres";
  }
  if (!/[A-Z]/.test(password)) {
    return "A senha precisa ter pelo menos uma letra maiúscula";
  }
  if (!/[0-9]/.test(password)) {
    return "A senha precisa ter pelo menos um número";
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "A senha precisa ter pelo menos um caractere especial";
  }
  return null;
}
