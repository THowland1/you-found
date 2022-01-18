import mongoose, { ConnectOptions } from 'mongoose';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI!, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  } as ConnectOptions);
};

export default connectDB;
