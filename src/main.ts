import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	app.useGlobalPipes(
		new ValidationPipe({ whitelist: true, transform: true }),
	);

	const swaggerConfig = new DocumentBuilder()
		.setTitle('Car Rental API')
		.setVersion('1.0')
		.addBearerAuth()
		.addSecurityRequirements('bearer')
		.build();
	SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, swaggerConfig));
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
