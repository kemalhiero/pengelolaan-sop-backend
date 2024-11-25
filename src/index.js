import express, { urlencoded, json } from 'express';
const app = express()
const port = process.env.PORT

app.use(urlencoded({ extended: true }));
app.use(json());

import cors from 'cors';
app.use(cors());

// relasi antar tabel
import './models/db_association.js';

// router
import legalBasisRoute from './routes/legalBasisRoute.js';
import lawTypeRoute from './routes/lawTypeRoute.js';
import sopImplementer from './routes/sopImplementerRoute.js'
import organizationRoute from './routes/organizationRoute.js';
import userRoute from './routes/userRoute.js';
import sopRoute from './routes/sopRoute.js';
import sopDetailRoute from './routes/sopDetailRoute.js';
import drafterRoute from './routes/drafterRoute.js';

app
  .use('/api/sop', sopRoute)
  .use('/api/user', userRoute)
  .use('/api/law', legalBasisRoute)
  .use('/api/drafter', drafterRoute)
  .use('/api/lawtype', lawTypeRoute)
  .use('/api/org', organizationRoute)
  .use('/api/sopdetail', sopDetailRoute)
  .use('/api/implementer', sopImplementer);

app.get('/', (req, res) => {
  res.send('Bismillah wisuda tahun ini!')
});

// Jika route tidak ditemukan, lempar error 404
app.use((req, res, next) => {
  const error = new Error('Route tidak ditemukan');
  error.status = 404;
  next(error);
});

// Middleware error handler (untuk semua error)
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)  // Default status code 500 jika tidak ada
    .json({
      message: err.message,
    });
});


app.listen(port, () => {
  console.log(`Aplikasi berjalan di http://localhost:${port}`)
});
