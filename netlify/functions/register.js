
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

exports.handler = async (event) => {
  // Allow only POST requests
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
    const { name, email, password } = JSON.parse(event.body || "{}");

    // Validate input
    if (!name || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "All fields are required",
        }),
      };
    }

    if (password.length < 8) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Password must be at least 8 characters",
        }),
      };
    }

    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MongoDB configuration is missing");
    }

    client = new MongoClient(mongoUri);
    await client.connect();

    const db = client.db("jobconnect");
    const users = db.collection("users");

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing user
    const existingUser = await users.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return {
        statusCode: 409,
        body: JSON.stringify({
          message: "Email already registered",
        }),
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const result = await users.insertOne({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "jobseeker",
      createdAt: new Date(),
    });

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Registration successful",
        userId: result.insertedId,
      }),
    };

  } catch (error) {
    console.error("Registration error:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Registration failed",
      }),
    };

  } finally {
    if (client) {
      await client.close();
    }
  }
};

