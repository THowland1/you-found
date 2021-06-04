import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
  });
};

export default connectDB;
