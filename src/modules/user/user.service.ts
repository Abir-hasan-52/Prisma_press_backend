import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import { registerUserPayload } from "./user.interface";
 

const registerUserIntoDb = async (payload:registerUserPayload) => {
  const { name, email, password, profilePhoto } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });
  if (isUserExist) {
    throw new Error("User with this email already exists");
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const CreatedUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      profile:{
        create:{
          profilePhoto
        }
      }
    },
  });
  // await prisma.profile.create({
  //   data: {
  //     userId: CreatedUser.id,
  //     profilePhoto,
  //   },
  // });
  const user = await prisma.user.findUnique({
    where: {
      id: CreatedUser.id,
      email: CreatedUser.email || email,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  return user
};
const getMyProfileFromDB= async()=>{

}
export const userService={
    registerUserIntoDb
    getMyProfileFromDB
}
