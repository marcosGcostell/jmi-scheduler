import app from './app.js';

const port = process.env.NODE_ENV === 'production' ? 3000 : process.env.PORT;
app.listen(port, 'localhost', () => {
  console.log(`App running on port ${port}...`);
});
