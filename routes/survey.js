const express = require('express');
const sql = require('mssql');
const ejs = require('ejs');
const config = {
  user: 'your_username',
  password: 'your_password',
  server: 'your_server_name',
  database: 'your_database_name',
};

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('form');
});

app.post('/submit', async (req, res) => {
  const { timestamp, mobile_number, mobile, gender } = req.body;

  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('timestamp', sql.NVarChar, timestamp);
    request.input('mobile_number', sql.NVarChar, mobile_number);
    request.input('mobile', sql.NVarChar, mobile);
    request.input('gender', sql.NVarChar, gender);

    const query = 'INSERT INTO SurveyData_form (Timestamp, Mobile_Number, MOBILE, Gender) VALUES (@timestamp, @mobile_number, @mobile, @gender)';
    await request.query(query);
    console.log('Data inserted successfully.');
    res.redirect('/');
  } catch (error) {
    console.error(error);
  } finally {
    sql.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
