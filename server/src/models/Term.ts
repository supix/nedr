import { Schema, model, Document } from 'mongoose';

export interface ITerm extends Document {
  term: string;
  synonyms: string[];
  tags?: string[];
  updatedAt: Date;
}

const TermSchema = new Schema<ITerm>({
  term: { type: String, required: true, unique: true, lowercase: true, trim: true },
  synonyms: { type: [String], required: true, default: [], set: (arr: string[]) => arr.map((s) => s.toLowerCase()) },
  tags: { type: [String], required: false, default: [] },
  updatedAt: { type: Date, default: Date.now },
});

TermSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Term = model<ITerm>('Term', TermSchema, 'terms');
