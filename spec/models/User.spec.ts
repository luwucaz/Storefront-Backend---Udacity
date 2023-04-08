
import { UserModel, User } from "../../src/api/models/usersModel";

describe('User Model', () => {

  describe('Manipulate User Model methods', () => {
    let test_user: User = new User(
        "Arnold", "Schwarsnegger", "strongpassword"
    )

    it("should create the user", async () => {
      const result = await UserModel.createNewUser(
        test_user
      )
      expect(result).toEqual(
        true
      )
    })
    it("should delete the user", async () => {
        const result = await UserModel.deleteUserById(1)
        expect(result).toEqual(
            true
        )
    })

  });
});
