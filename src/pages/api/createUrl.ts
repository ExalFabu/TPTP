// import type { NextApiRequest, NextApiResponse } from 'next';
// import connectDB from '../../middleware/mongodb';
// import ShortUrl from '../../model/short_url';

// /**
//  * @deprecated vedi https://github.com/ExalFabu/TPTP/issues/30
//  */
// const createUrl = async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method !== 'POST') {
//     return;
//   }
//   const { name, lectures, options, averageBonus } = req.body;
//   if (!(name && lectures)) res.status(400).json({ error: 'Missing arguments' });
//   try {
//     let url_to_create = new ShortUrl({
//       name: name,
//       lectures: lectures,
//       options: options,
//       averageBonus: averageBonus,
//     });
//     let created = await url_to_create.save();
//     return res.status(200).json({ url: created._id });
//   } catch (error: unknown) {
//     return res.status(500).json({ error: error });
//   }
// };

// export default connectDB(createUrl);
export {}