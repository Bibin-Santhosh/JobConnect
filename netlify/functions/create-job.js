
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        message: "Method not allowed"
      })
    };
  }

  let client;

  try {
    const authHeader = event.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Please login first"
        })
      };
    }

    const jwtSecret = process.env.JWT_SECRET;
    const mongoUri = process.env.MONGO_URI;

    if (!jwtSecret || !mongoUri) {
      throw new Error("Server configuration missing");
    }

    const decoded = jwt.verify(token, jwtSecret);

    if (decoded.role !== "employer") {
      return {
        statusCode: 403,
        body: JSON.stringify({
          message: "Only employers can post jobs"
        })
      };
    }

    const {
      title,
      company,
      location,
      description,
      jobType,
      salary
    } = JSON.parse(event.body || "{}");

    if (
      !title?.trim() ||
      !company?.trim() ||
      !location?.trim() ||
      !description?.trim() ||
      !jobType?.trim()
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Please fill all required fields"
        })
      };
    }

    client = new MongoClient(mongoUri);
    await client.connect();

    const db = client.db("jobconnect");

    const result = await db.collection("jobs").insertOne({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      description: description.trim(),
      jobType: jobType.trim(),
      salary: salary || "",
      employerId: decoded.userId,
      status: "active",
      createdAt: new Date()
    });

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Job posted successfully",
        jobId: result.insertedId
      })
    };

  } catch (error) {
    console.error("Job posting error:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Unable to post job"
      })
    };

  } finally {
    if (client) {
      await client.close();
    }
  }
};
