import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Créer un admin par défaut
  const admin = await prisma.user.upsert({
    where: { email: 'admin@betesfrais.bj' },
    update: {},
    create: {
      email: 'admin@betesfrais.bj',
      passwordHash: '$2b$10$YourHashedPasswordHere', // À changer en production
      firstName: 'Admin',
      lastName: 'Bêtes & Frais',
      phone: '+22900000000',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('Created admin user:', admin.email);

  // Créer des catégories
  const categories = [
    { name: 'Viande de Bœuf', slug: 'viande-de-boeuf' },
    { name: 'Viande de Mouton', slug: 'viande-de-mouton' },
    { name: 'Viande de Chèvre', slug: 'viande-de-chevre' },
    { name: 'Viande de Porc', slug: 'viande-de-porc' },
    { name: 'Volailles', slug: 'volailles' },
    { name: 'Poissons', slug: 'poissons' },
    { name: 'Lapin', slug: 'lapin' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('Created categories');

  // Créer des animaux
  const animals = [
    { name: 'Bœuf', slug: 'boeuf' },
    { name: 'Mouton', slug: 'mouton' },
    { name: 'Chèvre', slug: 'chevre' },
    { name: 'Porc', slug: 'porc' },
    { name: 'Poulet', slug: 'poulet' },
    { name: 'Dinde', slug: 'dinde' },
    { name: 'Poisson', slug: 'poisson' },
    { name: 'Lapin', slug: 'lapin' },
  ];

  for (const animal of animals) {
    await prisma.animal.upsert({
      where: { slug: animal.slug },
      update: {},
      create: animal,
    });
  }

  console.log('Created animals');

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
