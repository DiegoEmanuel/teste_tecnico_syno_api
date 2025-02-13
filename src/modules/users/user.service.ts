import { UserRepository } from "./user.repository";
import { UserModel } from "../../models/user_model";

export class UserService {
  private userRepository = new UserRepository();

  async createUser(name: string, email: string, password: string) {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) throw new Error("Email já cadastrado")

    return this.userRepository.createUser(name, email, password);
  }

  async getAllUsers() {
    return this.userRepository.getAllUsers();
  }

  async updateUser(id: string, data: UserModel) {
    return this.userRepository.updateUser(id, data);
  }

  async deleteUser(id: string) {
    return this.userRepository.deleteUser(id);
  }

  async deleteAllUsers() {
    return this.userRepository.deleteAllUsers();
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findUserByEmail(email);
  }
}

