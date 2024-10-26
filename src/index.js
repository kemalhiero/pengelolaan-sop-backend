const express = require('express')
const app = express()
const port = process.env.PORT

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cors = require('cors');
app.use(cors());

// router
app.use('/api/law', require('./routes/legalBasisRoute'));
app.use('/api/lawtype', require('./routes/lawTypeRoute'));

app.get('/', (req, res) => {
  res.send('Bismillah wisuda tahun ini!')
})

app.listen(port, () => {
  console.log(`Aplikasi berjalan di http://localhost:${port}`)
})
