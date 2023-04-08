import Connection from "./db";

import { Product } from "./productsModel";
import { ProductModel } from "./productsModel";

class OrderItem {
    private product_id: number;
    private product_quantity: number;

    getProductId(): number {
        return this.product_id;
    }

    getProductQuantity(): number {
        return this.product_quantity
    }


    constructor(product_id: number, product_quantity: number) {
        this.product_id = product_id;
        this.product_quantity = product_quantity;
    }
}

class Order {
    private order_id?: number;
    private user_id: number;
    private order_status: string;
    private total_price: number;

    getOrderId() {
        return this.order_id;
    }
    getTotalPrice() {
        return this.total_price;
    }
    getUserId() {
        return this.user_id;
    }

    getStatus() {
        return this.order_status;
    }

    constructor( user_id: number,  order_status: string, total_price: number, order_id?: number) {
        this.user_id = user_id;
        this.order_status = order_status;
        this.total_price = total_price
        this.order_id = order_id;
    }

}

class OrderModel {
    static tableName: string = "Orders";

    static async getOrderById(id: number) {
        const query = {
            text: `SELECT * FROM ${this.tableName} WHERE id = $1`,
            values: [id],
        };
        const result = await Connection.query(query);
        if (result.rowCount != 0) {
            console.log(
                result.rows
            )
            const order: Order = new Order (
                result.rows[0].user_id,
                result.rows[0].order_status,
                result.rows[0].total_price,
                result.rows[0].id
            )
            return order
        } else {
            throw new Error("No order found with the specified id.");
        }

    }

    static async getAllOrders() {
        const query = {
            text: `SELECT * FROM ${this.tableName}`
        }
        // All users on the DB
        const result = await Connection.query(query)
        let orders: Order[] = []
        if (result.rowCount != 0) {
            result.rows.forEach(order => {
                orders.push(
                    new Order(
                        order.user_id,
                        order.order_status,
                        order.total_price,
                        order.id
                    )
                )
            });
            return orders
        } else {
            throw new Error("No orders found.");
        }
    }
    static async getItemsFromOrderByOrderId(order_id: number) {
        const query = {
            text: `SELECT * from ${this.tableName} join OrderItems on OrderItems.order_id = $1 where ${this.tableName}.id = $1`,
            values: [order_id],
        }
        const result = await Connection.query(query)
        if ( result.rowCount != 0) {
            let orderItems: OrderItem[] = []
            result.rows.forEach(orderItem => {
                orderItems.push(
                    new OrderItem(
                        orderItem.product_id,
                        orderItem.product_quantity
                    )
                )
            });
            return orderItems
        } else {
            throw new Error("No order items found for order");

        }
    }
    static async getCompletedOrdersByUser(user_id: number) {
        const query = {
            text: `select * from ${this.tableName} where ${this.tableName}.order_status = 'complete' and ${this.tableName}.user_id = $1`,
            values: [user_id]
        }
        const result = await Connection.query(query)
        let completedOrders: Order[] = []
        if (result.rowCount != 0) {
            result.rows.forEach(order => {
                completedOrders.push(
                    new Order(
                        user_id,
                        order.order_status,
                        order.total_price,
                        order.order_id
                    )
                )
            });
            return completedOrders
        } else {
            throw new Error("No completed orders for user.");
        }
    }
    static async getUserActiveOrdersByUserId(user_id: number) {
        const query = {
            text: `SELECT * FROM ${this.tableName} where ${this.tableName}.user_id = $1 and ${this.tableName}.order_status = 'active'`,
            values: [user_id]
        }
        const result = await Connection.query(query)
        if ( result.rowCount != 0) {
            let userActiveOrders: Order[] = []
            result.rows.forEach(order => {
                userActiveOrders.push(
                    new Order(
                        order.user_id,
                        order.order_status,
                        order.total_price,
                        order.order_id
                    )
                )
            });
            return userActiveOrders
        } else {
            throw new Error("No active orders for user found");
        }

    }
    static async createNewOrder(order: Order, orderItems: OrderItem[]) {
        try {
            await Connection.query('BEGIN');
            // Insert the order data into the Orders table
            const orderResult = await Connection.query(
                `INSERT INTO Orders(user_id, total_price, order_status)
             VALUES($1, $2, $3)
             RETURNING id`,
                [order.getUserId(), order.getTotalPrice(), order.getStatus()]
            );
            const order_id = orderResult.rows[0].id;
            // Insert the order item data into the Order_Items table
            for (const orderItem of orderItems) {
                await Connection.query(
                    `INSERT INTO OrderItems(order_id, product_id, product_quantity)
               VALUES($1, $2, $3)`,
                    [order_id, orderItem.getProductId(), orderItem.getProductQuantity()]
                );
            }
            await Connection.query('COMMIT');
            return (
                new Order(
                    order.getUserId(),
                    order.getStatus(),
                    order.getTotalPrice(),
                )
            )
        } catch (err) {
            await Connection.query('ROLLBACK');
            console.log(
                err
            );
            throw new Error("Could not register new order.");

        }
    }
    static async deleteOrderById(id: number){
        const query = {
            text: `DELETE FROM ${this.tableName} WHERE ID = $1`,
            values: [id]
        }
        const result = await Connection.query(query)

        if (result.rowCount != 0) {
           return true
        } else {
            throw new Error("No order with the specified was deleted.");

        }
    }
    static async updateOrderById(id: number, order_status: string) {
        const query = {
            text: `UPDATE ${this.tableName} SET order_status = $1 WHERE id = $2`,
            values: [order_status, id]
        }
        const result = await Connection.query(query)
        if (result.rowCount != 0) {
            // Return the updated order
            return await OrderModel.getOrderById(id)
        } else {
            throw new Error("Could not update order with specified id.");
        }


    }
}


export {
    OrderModel,
    OrderItem,
    Order
}
