import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * Para convertir a la clase entity en un documento de mongo
 * se debe extender de Document de la libreria de mongoose
 *
 * Se debe definir un scheque y exportarlo, este schema indica que columnas va
 * a tener, tamaño, etc.
 */
@Schema()
export class Pokemon extends Document{

  //Se usa para definir las propiedades de un atributo
  @Prop({
    unique: true,
    index: true
  })
  name: string;

  @Prop({
    unique: true,
    index: true
  })
  no: number;

}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon)
