
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        message: "Method not allowed",
      }),
    };
  }

  let client;

  try {
    const { email, password } = JSON.parse(event.body || "{}");

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Email and password are required",
        }),
      };
    }

    const mongoUri = process.env.MONGO_URI;
    const jwtSecret = process.env.JWT_SECRET;

    if (!mongoUri || !jwtSecret) {
      throw new Error("Server configuration is missing");
    }

    client = new MongoClient(mongoUri);
    await client.connect();

    const db = client.db("jobconnect");
    const users = db.collection("users");

    const normalizedEmail = email.trim().toLowerCase();

    const user = await users.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Invalid email or password",
        }),
      };
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Invalid email or password",
        }),
      };
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      jwtSecret,
      {
        expiresIn: "1h",
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Login successful",
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }),
    };

  } catch (error) {
    console.error("Login error:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Login failed",
      }),
    };

  } finally {
    if (client) {
      await client.close();
    }
  }
};
