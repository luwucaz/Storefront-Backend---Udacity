
import { ProductModel, Product } from "../../src/api/models/productsModel";

describe('Product Model', () => {

  describe('Manipulate Product Model methods', () => {
    let test_product: Product = new Product(
      "Cigar", 100, "luxury"
    );

    it("should create the product", async () => {
      const result = await ProductModel.createNewProduct(
        test_product
      )
      expect(result).toEqual(
        true
      )
    })
    it("should delete the product", async () => {
        const result = await ProductModel.deleteProductById(1)
        expect(result).toEqual(
            true
        )
    })

  });
});
