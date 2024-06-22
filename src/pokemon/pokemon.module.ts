import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports:[

    ConfigModule,

    MongooseModule.forFeature([
      //Se relaciona la bd de mongo con el documento
      {
        name:Pokemon.name,
        schema:PokemonSchema,
      }
    ])
  ],
  exports: [
    MongooseModule
  ]
})
export class PokemonModule {}
