import { usernameDisplayLength } from "@/config/user";

export const getUserDisplayName = (username: string | undefined) => {
  if (!username) {
    return "----";
  } else if (username.length > usernameDisplayLength) {
    return username.substring(0, usernameDisplayLength) + "..";
  }
  return username;
};
