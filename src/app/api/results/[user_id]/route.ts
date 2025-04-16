import { NextResponse } from 'next/server';
import connectMongo from '../../../../lib/mongoose';
import Result from '../../../model/result';
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
export async function GET(request: Request, { params }: { params: { user_id: string } }) {
  try {
    
    await connectMDB();

    const { user_id } = params;
    const result = await Result.findOne({ user_id }).sort({ attempt: -1 });

    if (!result) {
      return NextResponse.json({ message: 'Results not found' }, { status: 404 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { user_id: string } }) {
  try {
    await connectMDB();

    const { user_id } = params;
    const body = await request.json();
    const {
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
    } = body;

    const result = await Result.findOneAndUpdate(
      { user_id },
      {
        $set: {
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
        },
      },
      { new: true, sort: { attempt: -1 }, upsert: false }
    );

    if (!result) {
      return NextResponse.json({ message: 'Result not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Result updated successfully', result }, { status: 200 });
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ error: 'Failed to update result' }, { status: 500 });
  }
}
