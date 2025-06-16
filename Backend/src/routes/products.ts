import { Router } from 'express';
import { getProducts, getProductBySku } from '../controllers/productController';

const router = Router();

/**
 * @route   GET /products
 * @desc    Obtiene todos los productos
 * @access  Public
 */
router.get('/', getProducts);

/**
 * @route   GET /products/:sku
 * @desc    Obtiene un producto por SKU
 * @access  Public
 */
router.get('/:sku', getProductBySku);

export default router;