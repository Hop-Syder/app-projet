import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Bêtes & Frais API')
    .setDescription('API pour la plateforme de commerce de produits animaux')
    .setVersion('1.0')
    .addTag('auth', 'Authentification')
    .addTag('users', 'Utilisateurs')
    .addTag('customers', 'Clients')
    .addTag('products', 'Produits')
    .addTag('categories', 'Catégories')
    .addTag('animals', 'Animaux')
    .addTag('inventory', 'Stock & Inventaire')
    .addTag('orders', 'Commandes')
    .addTag('payments', 'Paiements')
    .addTag('deliveries', 'Livraisons')
    .addTag('restaurants', 'Restaurants')
    .addTag('reviews', 'Avis')
    .addTag('notifications', 'Notifications')
    .addTag('admin', 'Administration')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Prefixe global pour les routes
  app.setGlobalPrefix('api/v1');

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3001;

  await app.listen(port);
  console.log(`🚀 Application démarrée sur: http://localhost:${port}`);
  console.log(`📚 Documentation API: http://localhost:${port}/api`);
}

bootstrap();
