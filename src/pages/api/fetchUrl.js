import connectDB from '../../middleware/mongodb';
import ShortUrl from '../../model/short_url';
const fetchUrl = async (req, res) => {
  if (req.method !== 'POST') {
    return;
  }
  const { id } = req.body;
  if (!id) res.status(400).json({error: "Missing arguments"});
  try {
    let lectures = await ShortUrl.findById(id).exec();
    if(!lectures) return res.status(400).json({error: "id not found"})
    return res.status(200).json( lectures );
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export default connectDB(fetchUrl);
