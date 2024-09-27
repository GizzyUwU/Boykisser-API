import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const gitApiUrl = 'https://api.github.com/repos/GizzyUwU/Boykisser-API/contents/media';

      const { id } = req.query;

      if (!id) return res.status(400).json({ error: 'Missing "id" parameter in the query' });

      const response = await axios.get(gitApiUrl);

      const files = response.data.map(file => file.name);

      const file = files.find(file => file.split('.')[0] === id);

      if (!file) {
        return res.status(404).json({ error: `The ID "${id}" isn't used. Please specify a used id` });
      }

      const fileRawUrl = `https://raw.githubusercontent.com/GizzyUwU/Boykisser-API/main/media/${file}`;

      if (req.query.redirect === '0') {
        res.status(200).json({ file, url: fileRawUrl });
      } else {
        res.redirect(fileRawUrl);
      }
    } catch (error) {
      console.error('Error fetching file:', error);
      res.status(500).json({ error: 'Failed to fetch file from the repository' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
