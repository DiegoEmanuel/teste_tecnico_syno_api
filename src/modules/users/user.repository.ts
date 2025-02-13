import prisma from "../../database";
import { UserModel } from "../../models/user_model";

export class UserRepository {
  async createUser(name: string, email: string, password: string) {
    return prisma.users.create({ data: { email, password, name } });
  }

  async findUserByEmail(email: string) {
    return prisma.users.findUnique({ where: { email } });
  }

  async getAllUsers() {
    return prisma.users.findMany();
  }

  async updateUser(id: string, data: UserModel) {
    return prisma.users.update({ where: { id }, data });
  }

  async deleteUser(id: string) {
    return prisma.users.delete({ where: { id } });
  }

  async deleteAllUsers() {
    return prisma.users.deleteMany();
  }
}
