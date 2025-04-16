import mongoose, { Document, Schema } from 'mongoose';

interface IResult extends Document {
  user_id: string;
  attempt: number;
  personalityAnswers: any;
  soft_SkillsAnswers: any;
  careerAnswers: any;
  personalityNewScores: Record<string, number>;
  soft_SkillsNewScores: Record<string, number>;
  newGeneralScores: Record<string, number>;
  fieldScores: Record<string, number>;
  generalDiffScores: Record<string, number>;
  newGeneralProgressScores: Record<string, number>;
  newGeneralProgressCountScores: Record<string, number>;
}

const resultSchema: Schema = new Schema({
  user_id: { type: String, required: true },
  attempt: { type: Number, required: true, },
  personalityAnswers: { type: Schema.Types.Mixed },
  soft_SkillsAnswers: { type: Schema.Types.Mixed },
  careerAnswers: { type: Schema.Types.Mixed },
  personalityScores: { type: Map, of: Number},
  personalityCategoryScores: { type: Map, of: Number },
  soft_SkillScores: { type: Map, of: Number},
  careerScores: { type: Map, of: Number },
  fieldScores: { type: Map, of: Number },
  diffScores: { type: Map, of: Number },
  progressScores: { type: Map, of: Number },
  progressCountScores: { type: Map, of: Number },
});

// Check if the model is already compiled
let ResultModel: mongoose.Model<IResult>;

if (mongoose.models.Result) {
  ResultModel = mongoose.models.Result as mongoose.Model<IResult>;
} else {
  ResultModel = mongoose.model<IResult>('Result', resultSchema);
}

export default ResultModel;
