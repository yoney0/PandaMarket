import mongoose from 'mongoose';

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI 환경 변수가 설정되지 않았습니다.');
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected');
}

export default connectDatabase;
