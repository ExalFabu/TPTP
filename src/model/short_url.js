import mongoose from 'mongoose';
import { baseOptions, baseAverageBonus } from '../pages/[[...id]]';

const OptionSchema = new mongoose.Schema({
  removeCFU: { type: Boolean, required: true },
  cfu_value: { type: Number, required: true },
  mat_value: { type: Number, required: true },
  ptlode: { type: Number, required: true },
  incorso: { type: Number, required: true },
  erasmus: { type: Number, required: true },
});

const SingleAverageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  from: { type: Number, required: true },
  to: { type: Number, required: true },
  eq: { type: Number, required: true },
  label: { type: String, required: true },
  value: { type: Number, required: true },
});

const ShortUrlSchema = new mongoose.Schema({
  name: { type: String },
  lectures: {
    type: [],
    validate: {
      message: () => 'incorrect lecture arguments',
      validator: v => {
        return v.every(elem => {
          return (
            elem.length === 3 &&
            typeof elem[0] === 'string' &&
            (typeof elem[1] === 'number' || elem[1] === null) &&
            typeof elem[2] === 'boolean'
          );
        });
      },
    },
  },
  options: {
    type: OptionSchema,
    default: () => baseOptions(),
  },
  averageBonus: {
    type: [SingleAverageSchema],
    validate: {
      message: () => 'not the right amount of bonuses',
      validator: list => list.length === 12,
    },
    default: () => baseAverageBonus([]),
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  views: {type: Number, default: () => 0}
});

export default mongoose.models.short_url ||
  mongoose.model('short_url', ShortUrlSchema);
