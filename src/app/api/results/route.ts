import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '../../../lib/mongoose'; 
import ResultModel from '../../model/result'; 
import mongoose from 'mongoose';

const connectMDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}
export async function POST(request: NextRequest) {

  await connectMDB();

  try {
    const data = await request.json();

    const {
      user_id,
      personalityAnswers,
      personalityScores,
      personalityCategoryScores,
      soft_SkillsAnswers,
      soft_SkillScores,
      careerAnswers,
      careerScores,
      fieldScores,
      diffScores,
      progressScores,
      progressCountScores,
    } = data;

    const existingResult = await ResultModel.findOne({ user_id }).sort({ attempt: -1 });
    const attempt = existingResult ? existingResult.attempt + 1 : 0;

    const newResult = new ResultModel({
      user_id,
      attempt,
      personalityAnswers,
      personalityScores,
      personalityCategoryScores,
      soft_SkillsAnswers,
      soft_SkillScores,
      careerAnswers,
      careerScores,
      fieldScores,
      diffScores,
      progressScores,
      progressCountScores,
    });

    await newResult.save();

    return NextResponse.json({ message: 'Results stored successfully', user_id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to store results' }, { status: 500 });
  }
}
