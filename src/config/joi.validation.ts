import * as Joi from 'joi';

/**
 * Joi
 *
 * Se usa para definir las reglas de validación de las
 * variables de entorno
 *
 * Es una alternativa a app.config.ts
 */
export const JoiValidationSchema = Joi.object({
  MONGO: Joi.required(),
  PORT: Joi.number().default(3005),
  DEFAULT_LIMIT: Joi.number().default(6),
});