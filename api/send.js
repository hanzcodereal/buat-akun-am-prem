export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ status: false, message: 'Method not allowed' });
    }

    const { email, apikey } = req.query;

    if (!email) {
        return res.status(400).json({ status: false, message: 'Email is required' });
    }

    if (apikey !== 'hanz') {
        return res.status(401).json({ status: false, message: 'Invalid API key' });
    }

    try {
        const response = await fetch(
            `https://api.theresav.biz.id/premium/alightmotion/send?email=${encodeURIComponent(email)}&apikey=${apikey}`
        );
        const data = await response.json();

        return res.status(response.status).json(data);
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
              }
