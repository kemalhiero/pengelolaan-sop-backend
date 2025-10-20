import express, { json } from 'express';
const app = express()
const port = process.env.PORT

app.use(json());

import cors from 'cors';
app.use(cors());

// relasi antar tabel
import './models/db_association.js';

// router
import sopRoute from './routes/sopRoute.js';
import userRoute from './routes/userRoute.js';
import authRoute from './routes/authRoute.js';
import recordRoute from './routes/recordRoute.js';
import lawTypeRoute from './routes/lawTypeRoute.js';
import feedbackRoute from './routes/feedbackRoute.js';
import dashboardRoute from './routes/dashboardRoute.js';
import equipmentRoute from './routes/equipmentRoute.js';
import legalBasisRoute from './routes/legalBasisRoute.js';
import relatedSopRoute from './routes/relatedSopRoute.js';
import implementerRoute from './routes/implementerRoute.js';
import organizationRoute from './routes/organizationRoute.js';
import implementQualificationRoute from './routes/implementQualificationRoute.js';

app
  .use('/api/sop', sopRoute)
  .use('/api/auth', authRoute)
  .use('/api/user', userRoute)
  .use('/api/record', recordRoute)
  .use('/api/law', legalBasisRoute)
  .use('/api/lawtype', lawTypeRoute)
  .use('/api/org', organizationRoute)
  .use('/api/feedback', feedbackRoute)
  .use('/api/dashboard', dashboardRoute)
  .use('/api/equipment', equipmentRoute)
  .use('/api/relatedsop', relatedSopRoute)
  .use('/api/implementer', implementerRoute)
  .use('/api/iq', implementQualificationRoute);

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
  console.log(`Backend berjalan di http://localhost:${port}`)
});
