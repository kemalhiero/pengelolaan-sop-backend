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

app
  .use('/api/law', legalBasisRoute)
  .use('/api/lawtype', lawTypeRoute)
  .use('/api/implementer', sopImplementer)
  .use('/api/org', organizationRoute);

app.get('/', (req, res) => {
  res.send('Bismillah wisuda tahun ini!')
})

app.listen(port, () => {
  console.log(`Aplikasi berjalan di http://localhost:${port}`)
})
