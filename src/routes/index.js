const { Router } = require('express');
const carRoutes = require('./carRoutes');

const router = Router();

router.use('/api/v1', carRoutes);

router.get('/status', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});

module.exports = router;