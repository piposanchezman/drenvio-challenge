import mongoose, { Schema, type Document } from "mongoose"
import type { ISpecialPrice } from "../types"

export interface ISpecialPriceDocument extends ISpecialPrice, Document {}

const ProductSpecialPriceSchema: Schema = new Schema(
  {
    sku: {
      type: String,
      required: [true, "SKU is required"],
      trim: true,
      uppercase: true,
    },
    specialPrice: {
      type: Number,
      required: [true, "Special price is required"],
      min: [0, "Special price must be greater than or equal to 0"],
    },
  },
  { _id: false },
)

const SpecialPriceSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email format"],
    },
    user: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    products: {
      type: [ProductSpecialPriceSchema],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    collection: "preciosEspecialesSanchez27",
  },
)

export default mongoose.model<ISpecialPriceDocument>("SpecialPrice", SpecialPriceSchema)