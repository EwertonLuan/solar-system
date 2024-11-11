import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get('ConfigService')

    const validateOptions = config.get('validateOptions')
    app.useGlobalPipes(new ValidationPipe(validateOptions));

  
    const options = new DocumentBuilder()
        .setTitle('Solar System')
        .setDescription('API Doc')
        .setVersion('1.0')
        .addTag('Planets')
        .build();
  
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);
  
    const port = config.get('app.port');
    await app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    });
}
bootstrap();
