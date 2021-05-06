import connectDB from '../../middleware/mongodb';
import ShortUrl from '../../model/short_url';
const fetchUrl = async (req, res) => {
  if (req.method !== 'POST') {
    return;
  }
  const { id } = req.body;
  if (id === undefined)
    return res.status(400).json({ error: 'Missing arguments' });
  try {
    let output = await ShortUrl.findByIdAndUpdate(id, {
      updatedAt: Date.now(),
      $inc: { views: 1 },
    }).exec();
    if (output === undefined)
      return res.status(400).json({ error: 'id not found' });
    return res.status(200).json(output);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export default connectDB(fetchUrl);
