import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const lockSeatsSchema = Joi.object({
  showtimeId: Joi.string().required(),
  seats: Joi.array().items(Joi.string()).min(1).max(10).required()
});

export const confirmReservationSchema = Joi.object({
  showtimeId: Joi.string().required(),
  seats: Joi.array().items(Joi.string()).min(1).max(10).required(),
  selectedAddOns: Joi.array().items(
    Joi.object({
      addOnId: Joi.string().required(),
      name: Joi.string().optional(),
      price: Joi.number().optional(),
      quantity: Joi.number().integer().min(1).required()
    })
  ).optional()
});

export const kioskBookingSchema = Joi.object({
  showtimeId: Joi.string().required(),
  seats: Joi.array().items(Joi.string()).min(1).max(10).required(),
  kioskId: Joi.string().required()
});
