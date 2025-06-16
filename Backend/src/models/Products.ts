import mongoose, { Schema, type Document } from "mongoose"
import type { IProduct } from "../types"

export interface IProductDocument extends IProduct, Document {}

const ProductSchema: Schema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    precio: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be greater than or equal to 0"],
    },
    precioBase: {
      type: Number,
      required: [true, "Base price is required"],
      min: [0, "Base price must be greater than or equal to 0"],
    },
    categoria: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock must be greater than or equal to 0"],
    },
    imagen: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    marca: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating must be greater than or equal to 0"],
      max: [5, "Rating cannot be greater than 5"],
    },
  },
  {
    timestamps: true,
    collection: "productos",
  },
)

export default mongoose.model<IProductDocument>("Producto", ProductSchema)