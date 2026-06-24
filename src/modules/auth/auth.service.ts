import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

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

  const jwtPayload = {
    id: (await user).id,
    name: (await user).name,
    email: (await user).email,
    role: (await user).role,
  };

  //   const accessToken = jwt.sign(
  //     {
  //       jwtPayload,
  //     },
  //     config.jwt_access_secret,
  //     {
  //       expiresIn: config.jwt_access_expires_in,
  //     } as SignOptions,
  //   );

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );
//   const refreshToken = jwt.sign(
//     {
//       jwtPayload,
//     },
//     config.jwt_refresh_secret,
//     {
//       expiresIn: config.jwt_refresh_expires_in,
//     } as SignOptions,
//   );

const refreshToken=jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
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
