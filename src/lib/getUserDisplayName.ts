import { usernameDisplayLength } from "@/config/user";
import { User } from "@prisma/client";

export const getUserDisplayName = (user: User) => {
  if (user.name.length > usernameDisplayLength) {
    return user.name.substring(0, usernameDisplayLength) + "...";
  } else {
    return user.name;
  }
};
