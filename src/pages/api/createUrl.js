import mongoose from 'mongoose';
import connectDB from '../../middleware/mongodb';
import ShortUrl from '../../model/short_url';
const createUrl = async (req, res) => {
  if (req.method !== 'POST') {
    return;
  }
  const { name, lectures, options, averageBonus } = req.body;
  if (!(name && lectures)) res.status(400).json({ error: 'Missing arguments' });
  try {
    let url_to_create = new ShortUrl({
      name: name,
      lectures: lectures,
      options: options,
      averageBonus: averageBonus,
    });
    let created = await url_to_create.save();
    return res.status(200).json({ url: created._id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default connectDB(createUrl);
