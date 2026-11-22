
const { MongoClient } = require("mongodb");

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        message: "Method not allowed"
      })
    };
  }

  let client;

  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MongoDB configuration is missing");
    }

    client = new MongoClient(mongoUri);
    await client.connect();

    const db = client.db("jobconnect");

    const jobs = await db.collection("jobs")
      .find({ status: "active" })
      .sort({ createdAt: -1 })
      .toArray();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        success: true,
        count: jobs.length,
        jobs
      })
    };

  } catch (error) {
    console.error("Get jobs error:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Unable to fetch jobs"
      })
    };

  } finally {
    if (client) {
      await client.close();
    }
  }
};
