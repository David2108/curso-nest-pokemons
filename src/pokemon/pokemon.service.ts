import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  /**
   *
   * Inyectar el modelo
   */

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {

    try{
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    }catch (error){
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const {limit=this.defaultLimit, offset=0} = paginationDto;
    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset);
  }

  async findOne(term: string) {

    let pokemon: Pokemon;

    //Verifica si es un número
    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({no: term})
    }

    //Verifica si es un MongoId
    if(isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term);
    }

    //Si aún no le encuentra le busca por el nombre
    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name: term})
    }

    if(!pokemon){
      throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`);
    }

    return pokemon;

  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);

    if(updatePokemonDto.name){
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try{

      //{new: true} se usa para que devuelva el objeto actualizado
      //await pokemon.updateOne(updatePokemonDto, {new : true})
      await pokemon.updateOne(updatePokemonDto)

      return {...pokemon.toJSON(), ...updatePokemonDto};

    }catch (error){
      this.handleExceptions(error);
    }

  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});
    if(deletedCount === 0 ){
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
    }
    return;
  }

  private handleExceptions(error: any){

    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exists in db ${JSON.stringify(error.keyValue)}`);
    }

    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);

  }

}
