import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const gitApiUrl = 'https://api.github.com/repos/GizzyUwU/Boykisser-API/contents/media';

      const response = await axios.get(gitApiUrl);
      let files = response.data;

      if (files.length === 0) {
        return res.status(404).json({ error: 'No files found in the repository' });
      }

      const mediaType = req.query.mediaType;

      if (mediaType) {
        switch (mediaType.toLowerCase()) {
          case 'video':
            files = files.filter(file => file.name.endsWith('.mp4') || file.name.endsWith('.mov') || file.name.endsWith('.mkv'));
            break;
          case 'gif':
            files = files.filter(file => file.name.endsWith('.gif'));
            break;
          case 'image':
            files = files.filter(file => /\.(jpg|jpeg|png|bmp|webp)$/.test(file.name));
            break;
          default:
            return res.status(400).json({ error: 'Invalid file type specified' });
        }
      }

      if (files.length === 0) {
        return res.status(404).json({ error: `No ${mediaType} files found` });
      }

      const randomFile = files[Math.floor(Math.random() * files.length)];
      
      const fileRawUrl = randomFile.download_url;

      if (req.query.redirect === '0') {
        res.status(200).json({ file: randomFile.name, url: fileRawUrl });
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
