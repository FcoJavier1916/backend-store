export function getRandomAccount() {
  const cuentas = [
    process.env.ACOUNT_BANK_1,
    process.env.ACOUNT_BANK_2,
    process.env.ACOUNT_BANK_3,
  ].filter(Boolean);

  if (cuentas.length === 0) {
    throw new Error("No hay cuentas configuradas en las variables de entorno");
  }

  const randomIndex = Math.floor(Math.random() * cuentas.length);
  const [numero, banco] = cuentas[randomIndex].split("|");

  return { numero, banco };
}