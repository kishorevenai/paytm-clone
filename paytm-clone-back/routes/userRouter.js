const express = require("express");
const zod = require("zod");
const router = express.Router();
const userSchema = require("../schemas/users");
const bcrypt = require("bcrypt");
const signupZodSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
  firstname: zod.string(),
  lastname: zod.string(),
});
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  const body = req.body;
  const { success } = signupZodSchema.safeParse(body);
  if (!success) {
    return res
      .json({ message: "Email already taken / Incorrect inputs" })
      .status(500);
  }
  try {
    const user = await userSchema.findOne({ username: body.username }).lean();

    if (user._id) {
      return res
        .json({ message: "Email already taken / Incorrect input" })
        .status(500);
    }
  } catch (error) {
    return res.json({ message: "Failed to check the credentials" }).status(500);
  }

  const hashedPwd = bcrypt.hash(body.password, 10);
  try {
    const new_user = await userSchema.create({
      username: body.username,
      password: hashedPwd,
      firstname: body.firstname,
      lastname: body.lastname,
    });

    const accessToken = jwt.sign(
      {
        credentials: {
          username: body.username,
          firstname: body.firstname,
          lastname: body.lastname,
        },
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "30m" }
    );
    const refreshToken = jwt.sign(
      {
        credentials: {
          username: body.username,
        },
      },
      process.env.REFRESH_TOKEN
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json(accessToken).status(201);
  } catch (error) {
    return res.json({ message: "Failed to check the credentials" }).status(500);
  }
});

module.exports = router;
