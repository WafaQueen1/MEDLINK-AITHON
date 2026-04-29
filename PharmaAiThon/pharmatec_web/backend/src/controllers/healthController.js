export const healthCheck = (req, res) => {
  res.json({
    message: 'Pharmatec Web API is running',
    timestamp: new Date().toISOString(),
  });
};
