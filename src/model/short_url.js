import mongoose from 'mongoose';
import { baseOptions, baseAverageBonus } from '../pages/[[...id]]';

const ShortUrlSchema = new mongoose.Schema({
  name: { type: String },
  lectures: { type: [] },
  options: { type: {}, default: () => baseOptions() },
  averageBonus: { type: [], default: () => baseAverageBonus([]) },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.short_url ||
  mongoose.model('short_url', ShortUrlSchema);
