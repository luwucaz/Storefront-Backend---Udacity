import express from "express";
const router = express.Router();

import { OrderItem, Order, OrderModel } from "./models/ordersModel";
import { Request, Response } from "express";
import { ProductModel } from "./models/productsModel";
import { authenticate } from './middleware/auth';


// Get all orders
router.get("/orders", authenticate, async (req: Request, res: Response) => {
    try {
        const result = await OrderModel.getAllOrders()
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

// Get all items on order
router.get("/orders/:id/items", authenticate, async (req: Request, res: Response) => {
    try {
        const order_id: number = Number(req.params.id)
        const result = await OrderModel.getItemsFromOrderByOrderId(order_id)
        return res.status(200).json(
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
})
// Get orders by id
router.get('/orders/:id', authenticate, async (req: Request, res: Response) => {
    try {
        const id: number = Number(req.params.id)
        const result = await OrderModel.getOrderById(id)
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

interface OrderRequestBody {
    order: {
        status: string;
        user_id: number;
        orderItems: {
            product_id: number;
            quantity: number;
        }[];
    };
}
// Completed orders
router.get("/orders/complete/by/:id", authenticate, async (req: Request, res: Response) => {
    try {
        const user_id: number = Number(req.params.id);
        const result = await OrderModel.getCompletedOrdersByUser(user_id)
        return res.status(200).json(
            result
        )
    } catch (error) {
        console.log(
            error
        )
        return res.status(500).json({
            error: false,
            message: `${error}`
        })
    }

})
router.get("/orders/active/by/:id", authenticate, async (req: Request, res: Response) => {
    try {
        const user_id: number = Number(req.params.id);
        const result = await OrderModel.getUserActiveOrdersByUserId(user_id)
        return res.status(200).json(
            result
        )
    } catch (error) {
        console.log(
            error
        )
        return res.status(500).json({
            error: false,
            message: `${error}`
        })
    }

})
// Delete order
router.delete("/orders/delete/:id", authenticate, async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        await OrderModel.deleteOrderById(id);
        return res.status(200).json(
            {
                sucess: true,
                message: "Successfuly deleted order."
            }
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
})
// Create a new order
router.post("/orders/create", authenticate, async (req: Request, res: Response) => {
    try {

        let orderItemsArr: OrderItem[] = []
        const { order } = req.body as OrderRequestBody
        for (const orderItem of order.orderItems) {
            orderItemsArr.push(
                new OrderItem(
                    orderItem.product_id,
                    orderItem.quantity
                )
            )
        }
        // Calculate the total price
        // TODO: Merge with the loop above
        let totalPrice = 0
        for (const orderItem of orderItemsArr) {
            var productPrice = await ProductModel.getProductPriceById(orderItem.getProductId())
            var productQuantity = orderItem.getProductQuantity()
            if (productQuantity <= 0) {
                throw new Error("Invalid product quantity.");
            }
            totalPrice += productPrice * productQuantity
        }
        const newOrder: Order = new Order(
            order.user_id, order.status, totalPrice
        )
        await OrderModel.createNewOrder(newOrder, orderItemsArr)
        return res.status(200).json({
            success: true,
            message: "Succesfully created new order."
        })
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

export default router;
