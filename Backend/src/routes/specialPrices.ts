import { Router } from 'express';
import {
  getUsers,
  getSpecialPricesByEmail,
  createSpecialPriceUser,
  updateSpecialPrice
} from '../controllers/specialPriceController';
import {
  validateEmail,
  validateCreateSpecialPrice,
  validateUpdateSpecialPrice
} from '../middleware/validation';

const router = Router();

/**
 * @route   GET /special-prices/users
 * @desc    Obtiene todos los usuarios registrados en precios especiales
 * @access  Public
 */
router.get('/users', getUsers);

/**
 * @route   GET /special-prices/:email
 * @desc    Obtiene los precios especiales para un usuario específico
 * @access  Public
 */
router.get('/:email', validateEmail, getSpecialPricesByEmail);

/**
 * @route   POST /special-prices
 * @desc    Crea un nuevo usuario con precios especiales
 * @access  Public
 */
router.post("/", validateCreateSpecialPrice, createSpecialPriceUser);

/**
 * @route   PUT /special-prices/:email
 * @desc    Actualiza los precios especiales para un usuario existente
 * @access  Public
 */
router.put("/:email", validateUpdateSpecialPrice, updateSpecialPrice);

export default router;