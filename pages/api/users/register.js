import bcrypt from "bcrypt";

import User from "../../../models/user.model";
import dbconnect from "../../../libs/dbConnect";

export default async function handler(req, res) {
  await dbconnect();
  const { method, body } = req;

  if (method === "POST") {
    // checking to see if email is already in the system
    let user = await User.findOne({ email: body.email });
    if (user) {
      return res.status(400).json({ msg: "Email already use." });
    }

    // hashing  of password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // creating the user
    user = await User.create({
      email: body.email,
      password: hashedPassword,
      firstName: body.firstName,
      lastName: body.lastName,
    });

    // return the user
    res.status(201).json({ user });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
