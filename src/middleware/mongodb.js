import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({path: __dirname + "../../"})

const connectDB = handler => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    return handler(req, res);
  }
  // Use new db connection
  await mongoose.connect(
    process.env.MONGODB_URL,
    {
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useNewUrlParser: true,
    }
  );
  return handler(req, res);
};

export default connectDB;
