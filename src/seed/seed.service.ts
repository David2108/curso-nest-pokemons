import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {}

  async executeSeed(){

    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=650`);

    const pokemonToInsert: {name: string, no: number}[] = [];

    for (const { name, url } of data.results) {

      const segments = url.split('/');
      const no: number = +segments[segments.length-2];

      pokemonToInsert.push({name, no});

    }

    //Inserta los datos de una colección
    await this.pokemonModel.insertMany(pokemonToInsert);

    return data.results;

  }

}
