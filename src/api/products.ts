import express from "express";
const router = express.Router();

import { Product, ProductModel } from "./models/productsModel";
import { Request, Response } from "express";
import { authenticate } from './middleware/auth';

// Get all products
router.get("/products", async (req: Request, res: Response) => {
  try {
    const result = await ProductModel.getAllProducts()
    return res.json(
      result
    )
  } catch (error) {
    console.log(
      error
    )
    return res.status(500).json({
      error: true,
      message: `${error}`
    })
  }
});

// Get products by id
router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const id: number = Number(req.params.id)
    const result = await ProductModel.getProductById(id)
    return res.json(
      result
    )

  } catch (error) {
    console.log(
      error
    )
    return res.status(
      500
    ).json(
      {
        error: true,
        message: `${error}`
      }
    )
  }
});

// Get products by category
router.get('/products/by/category/:category', async (req: Request, res: Response) => {
  try {
    const category: string = req.params.category;
    const result = await ProductModel.getProductByCategory(category)
    return res.json(
      result
    )
  } catch (error) {
    console.log(
      error
    )
    return res.status(
      500
    ).json(
      {
        error: true,
        message: `${error}`
      }
    )
  }
});
// Delete product
router.delete("/products/delete/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const id: number =  Number(req.params.id)
    await ProductModel.deleteProductById(id)
    return res.status(200).json({
      error: false,
      message: `Product with id: ${id} deleted successfully.`
    })
  } catch (error) {
    console.log(
      error
    )
      return res.json(500).json({
        error: true,
        message: `${error}`
      })
  }
})

// Create a new product
router.post("/products/create", authenticate, async (req: Request, res: Response) => {
  try {
    const {
      name,
      price,
      category
    } = req.body

    const product = new Product(
      name,
      price,
      category
    )

    await ProductModel.createNewProduct(product)
    res.status(201).json({
      sucess: "Product created succesfully."
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: `${error}`
    }
    );

  }
});

export default router;
