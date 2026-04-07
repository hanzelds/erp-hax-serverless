import { PrismaClient, UserRole, ContactType, AccountType, ExpenseCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ── Unidades de negocio ─────────────────────────────────
  const hax = await prisma.businessUnit.upsert({
    where: { id: "bu_hax" },
    update: {},
    create: { id: "bu_hax", name: "Hax Estudio", description: "Unidad de diseño y creatividad" },
  });
  const koder = await prisma.businessUnit.upsert({
    where: { id: "bu_koder" },
    update: {},
    create: { id: "bu_koder", name: "Koder", description: "Unidad de tecnología y desarrollo" },
  });
  console.log("✓ Business units");

  // ── Usuario admin ───────────────────────────────────────
  const hashed = await bcrypt.hash("Admin123!", 12);
  await prisma.user.upsert({
    where: { email: "hanzel@hax.com.do" },
    update: {},
    create: {
      name: "Hanzel De Los Santos",
      email: "hanzel@hax.com.do",
      password: hashed,
      role: UserRole.ADMIN,
    },
  });
  console.log("✓ Admin user (hanzel@hax.com.do / Admin123!)");

  // ── Plan de cuentas (estándar RD) ───────────────────────
  const accounts = [
    // Activos
    { id: "acc_1000", code: "1000", name: "Activos", type: AccountType.ASSET, parentId: null },
    { id: "acc_1100", code: "1100", name: "Caja", type: AccountType.ASSET, parentId: "acc_1000" },
    { id: "acc_1200", code: "1200", name: "Banco", type: AccountType.ASSET, parentId: "acc_1000" },
    { id: "acc_1300", code: "1300", name: "Cuentas por Cobrar", type: AccountType.ASSET, parentId: "acc_1000" },
    { id: "acc_1400", code: "1400", name: "ITBIS por Cobrar", type: AccountType.ASSET, parentId: "acc_1000" },
    // Pasivos
    { id: "acc_2000", code: "2000", name: "Pasivos", type: AccountType.LIABILITY, parentId: null },
    { id: "acc_2100", code: "2100", name: "Cuentas por Pagar", type: AccountType.LIABILITY, parentId: "acc_2000" },
    { id: "acc_2200", code: "2200", name: "ITBIS por Pagar", type: AccountType.LIABILITY, parentId: "acc_2000" },
    // Patrimonio
    { id: "acc_3000", code: "3000", name: "Patrimonio", type: AccountType.EQUITY, parentId: null },
    { id: "acc_3100", code: "3100", name: "Capital", type: AccountType.EQUITY, parentId: "acc_3000" },
    // Ingresos
    { id: "acc_4000", code: "4000", name: "Ingresos", type: AccountType.INCOME, parentId: null },
    { id: "acc_4100", code: "4100", name: "Servicios Hax Estudio", type: AccountType.INCOME, parentId: "acc_4000" },
    { id: "acc_4200", code: "4200", name: "Servicios Koder", type: AccountType.INCOME, parentId: "acc_4000" },
    // Gastos
    { id: "acc_5000", code: "5000", name: "Gastos", type: AccountType.EXPENSE, parentId: null },
    { id: "acc_5100", code: "5100", name: "Gastos Operativos", type: AccountType.EXPENSE, parentId: "acc_5000" },
    { id: "acc_5200", code: "5200", name: "Gastos de Marketing", type: AccountType.EXPENSE, parentId: "acc_5000" },
    { id: "acc_5300", code: "5300", name: "Nómina", type: AccountType.EXPENSE, parentId: "acc_5000" },
    { id: "acc_5400", code: "5400", name: "Alquiler", type: AccountType.EXPENSE, parentId: "acc_5000" },
    { id: "acc_5500", code: "5500", name: "Tecnología", type: AccountType.EXPENSE, parentId: "acc_5000" },
  ];

  for (const acc of accounts) {
    await prisma.chartAccount.upsert({
      where: { id: acc.id },
      update: {},
      create: acc,
    });
  }
  console.log("✓ Chart of accounts");

  // ── Productos / Servicios de muestra ────────────────────
  await prisma.product.upsert({
    where: { code: "SRV-HAX-001" },
    update: {},
    create: {
      code: "SRV-HAX-001",
      name: "Diseño de Identidad Visual",
      description: "Branding completo: logo, paleta, tipografía",
      price: 45000,
      taxRate: 0.18,
    },
  });
  await prisma.product.upsert({
    where: { code: "SRV-KDR-001" },
    update: {},
    create: {
      code: "SRV-KDR-001",
      name: "Desarrollo Web",
      description: "Desarrollo de aplicación web a medida",
      price: 85000,
      taxRate: 0.18,
    },
  });
  await prisma.product.upsert({
    where: { code: "SRV-KDR-002" },
    update: {},
    create: {
      code: "SRV-KDR-002",
      name: "Mantenimiento Mensual",
      description: "Soporte y mantenimiento de sistemas",
      price: 12000,
      taxRate: 0.18,
    },
  });
  console.log("✓ Sample products");

  // ── Contactos de muestra ────────────────────────────────
  await prisma.contact.upsert({
    where: { id: "cnt_demo_1" },
    update: {},
    create: {
      id: "cnt_demo_1",
      type: ContactType.CLIENT,
      name: "María García",
      businessName: "Grupo García SRL",
      rnc: "101234567",
      email: "maria@grupogarcia.com.do",
      phone: "8091234567",
      city: "Santo Domingo",
    },
  });
  await prisma.contact.upsert({
    where: { id: "cnt_demo_2" },
    update: {},
    create: {
      id: "cnt_demo_2",
      type: ContactType.CLIENT,
      name: "Carlos Méndez",
      businessName: "Distribuidora Méndez EIRL",
      rnc: "109876543",
      email: "carlos@mendez.com.do",
      phone: "8097654321",
      city: "Santiago",
    },
  });
  console.log("✓ Sample contacts");

  console.log("\n✅ Seed completado.");
  console.log("   Login: hanzel@hax.com.do");
  console.log("   Pass:  Admin123!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
