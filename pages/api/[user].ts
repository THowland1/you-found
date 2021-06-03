import db from '../../utils/db';

export default async (req, res) => {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const doc = await db.collection('users').doc(id).get();
      if (!doc.exists) {
        res.status(404).end();
      } else {
        res.status(200).json(doc.data());
      }
    }
    res.status(200).end();
  } catch (e) {
    res.status(400).end();
  }
};
