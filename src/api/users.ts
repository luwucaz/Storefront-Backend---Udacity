import express from "express";
const router = express.Router();

import { User, UserModel } from "./models/usersModel";
import { Request, Response } from "express";
import { authenticate } from './middleware/auth';

// Get all users
router.get("/users", authenticate, async (req: Request, res: Response) => {
  try {
    const result = await UserModel.gettAllUsers()
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

// Get users by id
router.get('/users/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const id: number = Number(req.params.id)
    const result = await UserModel.getUserById(id)
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
// Delete a user
router.delete("/users/delete/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    await UserModel.deleteUserById(id)
    return res.status(200).json({
      error: false,
      message: `Deleted user with id ${id}`
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
})
// Create a user
router.post("/users/create", async (req: Request, res: Response) => {
  try {
    const {
      first_name,
      last_name,
      password
    } = req.body

    const user = new User(
      first_name,
      last_name,
      password
    )

    await UserModel.createNewUser(user)
    res.status(201).json({
      sucess: "User created succesfully."
    });

  } catch (error) {
    return res.status(500).json({
      error: false,
      message: `${error}`
    }
    );

  }
});

export default router;
