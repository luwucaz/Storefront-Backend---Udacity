import Connection from "./db";
import bcrypt from "bcrypt"

class User {
  private user_id?: string
  private first_name: string
  private last_name: string
  private hashed_password: string
  getUserId() {
    return this.user_id
  }
  getFirstName() {
    return this.first_name
  }
  getLastName() {
    return this.last_name
  }
  getHashedPassword() {
    return this.hashed_password
  }
  verifyPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.hashed_password);
  }
  constructor(firstName: string, lastName: string, password: string, user_id?: string) {
    this.first_name = firstName;
    this.last_name = lastName;
    this.user_id = user_id
    this.hashed_password = bcrypt.hashSync(
      password, 10
    );
  }
}

class UserModel {
  static tableName: string = "Users";
  static saltRounds: number = 10;

  static async getUserById(userId: number) {
    const query = {
      text: `SELECT * FROM ${this.tableName} WHERE id = $1`,
      values: [userId],
    };
    const result = await Connection.query(query);
    if (result.rowCount != 0) {
        let users: User[] = []
        result.rows.forEach(user => {
            users.push(
              new User(
                user.first_name,
                user.last_name,
                user.password,
                user.id
              )
            )
        });
        return users
    } else {
      throw new Error("No user found with specified id.")
    }

  }

  static async gettAllUsers() {
    const query = {
      text: `SELECT * FROM ${this.tableName}`
    }
    // All users on the DB
    const result = await Connection.query(query)
    let users: User[] = []
    if (result.rowCount != 0) {
        result.rows.forEach(user => {
          users.push(
            new User(
              user.first_name,
              user.last_name,
              user.password,
              user.id
            )
          )
        });

        return users
    } else {
      throw new Error("No users found.")
    }
  }
static async deleteUserById(id: number) {
  const query = {
    text: `DELETE FROM ${this.tableName} WHERE id = $1`,
    values: [id]
  }
  const result = await Connection.query(query)
  if (result.rowCount != 0 ) {
    return true
  } else {
    throw new Error(`Failed to delete user with id ${id}`);
  }
}
  static async createNewUser(user: User) {
    const query = {
      text: `INSERT INTO Users(first_name, last_name, password) values ($1, $2, $3)`,
      values: [
        user.getFirstName(),
        user.getLastName(),
        user.getHashedPassword()
      ],
    };
    await Connection.query(
      query
    )
    return true;
  }

}

export {
  UserModel,
  User
}
