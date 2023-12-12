import mongoose from "mongoose";

export default async function db(dbConnectionString: string) {
  try {
    await mongoose.connect(dbConnectionString),
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };
  } catch (err) {
    console.error("Error connecting to database");
    process.exit(1);
  }
}
