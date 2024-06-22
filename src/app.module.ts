import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import {join} from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/app.config';
import * as process from 'node:process';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [

    //Configuración para archivos .env
    ConfigModule.forRoot({
      //Carga el archivo de configuración al iniciar
      load: [EnvConfiguration],
      //Carga las reglas de validación, se ejecuta antes del load
      validationSchema: JoiValidationSchema
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),

    //Configuración MongoDB
    MongooseModule.forRoot(process.env.MONGODB, {
      dbName: 'pokemonsdb'
    }),

    PokemonModule,
    CommonModule,
    SeedModule

  ],
})
export class AppModule {}
