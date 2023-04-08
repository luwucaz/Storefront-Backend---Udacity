
/* eslint-disable no-undef */
import { OrderModel, Order, OrderItem } from "../../src/api/models/ordersModel";
import { UserModel, User } from "../../src/api/models/usersModel";
import { ProductModel, Product } from "../../src/api/models/productsModel";

describe('OrderModel Model', () => {
  it('should have a getItemsFromOrderByOrderId method', () => {
    expect(OrderModel.getItemsFromOrderByOrderId).toBeDefined();
  });
  it('should have a getAllOrders method', () => {
    expect(OrderModel.getAllOrders).toBeDefined();
  });
  it('should have an updateOrderById  method', () => {
    expect(OrderModel.updateOrderById).toBeDefined();
  });
  it('should have a deleteOrderById method', () => {
    expect(OrderModel.deleteOrderById).toBeDefined();
  });
  it('should have a createNewOrder method', () => {
    expect(OrderModel.createNewOrder).toBeDefined();
  });
  describe('Manipulate OrderModel methods', () => {
    let test_user: User = new User(
      "Arnold", "Schwarzenegger", "strongpassword"
    );
    let test_product: Product = new Product(
      "Cigar", 100, "luxury"
    );

    let test_order: Order = new Order(
      1, "complete", 100
   )
   let test_order_items: OrderItem[] = [
     new OrderItem(1, 2),
     new OrderItem(1, 2)
   ]

    beforeAll(async () => {
      await UserModel.createNewUser(
        test_user
      );
      await ProductModel.createNewProduct(
        test_product
      )
    });

    it('should create OrderModel using createNewOrder method', async () => {
      const result = await OrderModel.createNewOrder(test_order, test_order_items)
      expect(result).toEqual(
        test_order
      );
    });
    it("should return the right orders using getAllOrders",async () => {
      const result = await OrderModel.getAllOrders();
       expect(result).toEqual(
        [
          new Order(
            1, "complete", 100, 1
          )
        ]
       )
    })
    it("should return the right order using getOrderById", async () => {
      const result = await OrderModel.getOrderById(1)
      expect(result).toEqual(
        new Order(
          1, "complete", 100, 1
        )
      )
    })

  });
});
