import { PrismaClient, Role, UnitType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@betesetfrais.bj' },
    update: {},
    create: {
      email: 'admin@betesetfrais.bj',
      password: adminPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: Role.SUPER_ADMIN,
    },
  });
  console.log(`Admin user ready: ${admin.email} / Admin123!`);

  const customerPassword = await bcrypt.hash('Client123!', 10);
  const customerUser = await prisma.user.upsert({
    where: { email: 'client@betesetfrais.bj' },
    update: {},
    create: {
      email: 'client@betesetfrais.bj',
      password: customerPassword,
      firstName: 'Ama',
      lastName: 'Client',
      phone: '+229 90 00 00 00',
      role: Role.CUSTOMER,
      customerProfile: { create: {} },
    },
  });
  console.log(`Customer user ready: ${customerUser.email} / Client123!`);

  const animalsData = [
    { name: 'Bœuf', slug: 'boeuf' },
    { name: 'Mouton', slug: 'mouton' },
    { name: 'Chèvre', slug: 'chevre' },
    { name: 'Porc', slug: 'porc' },
    { name: 'Lapin', slug: 'lapin' },
    { name: 'Volaille', slug: 'volaille' },
    { name: 'Poisson', slug: 'poisson' },
  ];
  const animals: Record<string, string> = {};
  for (const a of animalsData) {
    const animal = await prisma.animal.upsert({ where: { slug: a.slug }, update: {}, create: a });
    animals[a.slug] = animal.id;
  }

  const categoriesData = [
    { name: 'Bœuf', slug: 'boeuf', position: 1 },
    { name: 'Mouton', slug: 'mouton', position: 2 },
    { name: 'Chèvre', slug: 'chevre', position: 3 },
    { name: 'Porc', slug: 'porc', position: 4 },
    { name: 'Volailles', slug: 'volailles', position: 5 },
    { name: 'Poissons', slug: 'poissons', position: 6 },
  ];
  const categories: Record<string, string> = {};
  for (const c of categoriesData) {
    const category = await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
    categories[c.slug] = category.id;
  }

  const productsData = [
    {
      name: 'Bœuf entrecôte',
      slug: 'boeuf-entrecote',
      description: 'Entrecôte de bœuf frais, idéale pour la grillade.',
      categorySlug: 'boeuf',
      animalSlug: 'boeuf',
      price: 4500,
      pricePerKg: 4500,
      unitType: UnitType.KG,
      minWeight: 0.5,
      maxWeight: 3,
      weightIncrement: 0.25,
      isFeatured: true,
      origin: 'Bénin',
    },
    {
      name: 'Gigot de mouton',
      slug: 'gigot-mouton',
      description: 'Gigot de mouton entier, préparation sur demande.',
      categorySlug: 'mouton',
      animalSlug: 'mouton',
      price: 5200,
      pricePerKg: 5200,
      unitType: UnitType.KG,
      minWeight: 1,
      maxWeight: 4,
      weightIncrement: 0.5,
      isFeatured: true,
      origin: 'Bénin',
    },
    {
      name: 'Poulet entier fermier',
      slug: 'poulet-entier',
      description: 'Poulet fermier prêt à cuire.',
      categorySlug: 'volailles',
      animalSlug: 'volaille',
      price: 3500,
      unitType: UnitType.PIECE,
      isFeatured: true,
      origin: 'Bénin',
    },
    {
      name: 'Tilapia frais',
      slug: 'tilapia-frais',
      description: 'Tilapia frais du jour, vidé et écaillé sur demande.',
      categorySlug: 'poissons',
      animalSlug: 'poisson',
      price: 2800,
      pricePerKg: 2800,
      unitType: UnitType.KG,
      minWeight: 0.5,
      maxWeight: 2,
      weightIncrement: 0.25,
      origin: 'Bénin',
    },
  ];

  for (const p of productsData) {
    const { categorySlug, animalSlug, ...rest } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...rest,
        categoryId: categories[categorySlug],
        animalId: animals[animalSlug],
        cutOptions: {
          create: [
            { name: 'Entier', priceModifier: 0 },
            { name: 'Morceaux', priceModifier: 0 },
            { name: 'Tranches fines', priceModifier: 200 },
          ],
        },
        packagingOptions: {
          create: [
            { name: 'Sous vide', priceModifier: 300 },
            { name: 'Sachet standard', priceModifier: 0 },
          ],
        },
      },
    });
  }
  console.log(`${productsData.length} produits créés.`);

  await prisma.deliveryZone.upsert({
    where: { id: 'seed-zone-cotonou' },
    update: {},
    create: {
      id: 'seed-zone-cotonou',
      name: 'Cotonou Centre',
      description: 'Zone de livraison centrale de Cotonou',
      fee: 1000,
      minOrder: 3000,
      cities: ['Cotonou'],
      districts: ['Akpakpa', 'Cadjehoun', 'Gbégamey'],
    },
  });
  await prisma.deliveryZone.upsert({
    where: { id: 'seed-zone-calavi' },
    update: {},
    create: {
      id: 'seed-zone-calavi',
      name: 'Abomey-Calavi',
      description: 'Zone de livraison Abomey-Calavi',
      fee: 1500,
      minOrder: 3000,
      cities: ['Abomey-Calavi'],
      districts: ['Godomey', 'Cocotomey'],
    },
  });
  console.log('Zones de livraison créées.');

  console.log('Seed terminé.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
