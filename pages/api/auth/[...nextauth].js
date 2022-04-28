import NextAuth from "next-auth";
import bcrypt from "bcrypt";
import dbConnect from "../../../libs/dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";

import User from "../../../models/user.model";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Priscilla",
      credentials: {
        email: {
          lable: "Email Address",
          type: "email",
          placeholder: "abbampriscilla771@gmail.com",
          required: true,
        },
        password: {
          type: "password",
          label: "password",
          placeholder: "Please enter your password",
        },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        // checking if user is on the database
        let user = await User.findOne({ email });
        if (!user) {
          return null;
        }

        // checking if passwords match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        // returning the user
        return user;
      },
    }),
  ],
  callback: {
    jwt: ({ token, user }) => {
      if (token) {
        token.id = user._id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session) {
        session.id = token.id;
        session.firstName = token.firstName;
        session.lastName = token.lastName;
      }
      return session;
    },
  },
  secret: "secret",
  jwt: {
    secret: "ThisIsMySecret",
    encrypt: true,
  },
});
