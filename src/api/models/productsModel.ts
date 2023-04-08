import Connection from "./db";

class Product {
    private id?: number
    private name: string
    private price: number
    private category: string
    getId() {
        return this.id
    }
    getName() {
        return this.name
    }
    getPrice() {
        return this.price
    }
    getCategory() {
        return this.category
    }
    constructor(name: string, price: number, category: string, id?: number) {
        this.name = name;
        this.price = price;
        this.category = category;
        this.id = id
    }
}

class ProductModel {
    static tableName: string = "Products";

    static async getProductById(id: number) {
        const query = {
            text: `SELECT * FROM ${this.tableName} WHERE id = $1`,
            values: [id],
        };
        const result = await Connection.query(query);
        if (result.rowCount != 0) {
            let product: Product = new Product(
                result.rows[0].name,
                result.rows[0].price,
                result.rows[0].category,
                result.rows[0].id
            )
            return product
        } else {
            throw new Error("No product found with the specified id.");
        }
    }
    static async getProductPriceById(id: number) :Promise<number> {
        const query = {
            text: `SELECT price FROM ${this.tableName} where id = $1`,
            values: [id],
        }
        const result = await Connection.query(query)
        if (result.rowCount != 0) {
            return parseFloat(result.rows[0].price)

        } else {
            throw new Error("No product found with id.");

        }
    }
    static async getProductByCategory(category: string) {
        const query = {
            text: `SELECT * FROM ${this.tableName} WHERE category = $1`,
            values: [category]
        }
        const result = await Connection.query(
            query
        )
        if (result.rowCount != 0) {
            let products: Product[] = []
            result.rows.forEach(product => {
                products.push(
                  new Product(
                    product.name,
                    product.price,
                    product.category,
                    product.id
                  )
                )
            });
            return products
        } else {
            throw new Error("No products found with the specified category.");
        }
    }

    static async getAllProducts() {
        const query = {
            text: `SELECT * FROM ${this.tableName}`
        }
        // All users on the DB
        const result = await Connection.query(query)

        if (result.rowCount != 0) {
            let products: Product[] = []
            result.rows.forEach(product => {
                products.push(
                    new Product(
                        product.name,
                        product.price,
                        product.category
                    )
                )
            });
            return products
        } else {
            throw new Error("No products found.");
        }
    }

    static async createNewProduct(product: Product) {
        const query = {
            text: `INSERT INTO Products(name, price, category) values ($1, $2, $3)`,
            values: [
                product.getName(),
                product.getPrice(),
                product.getCategory()
            ],
        };
        const result = await Connection.query(
            query
        )

        if (result.rowCount > 0) {
            return true; // query executed successfully
        } else {
            return false; // query did not execute successfully
        }
    }
    static async deleteProductById(id: number) {
        const query = {
            text: `DELETE FROM Products where ID = $1`,
            values: [id]
        }
        const result = await Connection.query(query)
        if(result.rowCount != 0) {
            return true;
        } else {
            throw new Error("Failed to delete product.");
        }
    }
}

export {
    ProductModel,
    Product
}
