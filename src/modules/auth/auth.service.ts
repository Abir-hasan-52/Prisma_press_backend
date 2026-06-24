import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface";

const loginUserFromDB = async (payload: ILoginUser) => {
  const { email, password } = payload;

  //     :----> findUnique: karon this does not provide proper error message. but findUniqueOrThrow provide a error mesasge when they con not find user.
  //   const user = await prisma.user.findUnique({
  //     where: {
  //       email,
  //     },
  //   });

  //   if (!user) {
  //     throw new Error("user not found");
  //   }

  // findUniqueOrThrow:---->
  const user = prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  const isPasswordMatched = await bcrypt.compare(
    password,
    (await user).password,
  );

  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }
  return user;
};

export const authService = {
  loginUserFromDB,
};

/**
 *
 * 1. find user by email,
 * 2. if not found then show a error message. elsaIf -- we use findUniqueOrThrow then its already provide an error when its did not found data
 * 3. then check password
 *  3.1 IF found the user then return the use
 *  3.2 if not found then throw an error
 */
