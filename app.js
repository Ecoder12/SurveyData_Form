const express = require('express');
const sql = require('mssql');
const ejs = require('ejs');
const config = {
  server: '182.77.57.62',
  port: 1433,
  database: 'voter',
  user: 'sa',
  password: 'Naxtre@124',
  options: {
    encrypt: false,
    trustServerCertificate: false,
  },
  requestTimeout: 600000
};
const app = express();
const port = 8500;

// Middleware to handle CORS (if needed)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('form');
});

app.post('/submit', async (req, res) => {
  const {
    timestamp,
    Constituency,
    mobile_number,
    gender,
    urban_or_rural,
    upcoming_election_party,
    party_2018,
    satisfaction_with_cm,
    satisfaction_with_mla,
    agent_id,
    remarks,
  } = req.body;

  console.log(req.body.otherOccupation);

  const otherOccupation = req.body.otherOccupation;

  const othercaste = req.body.othercaste;

  if (otherOccupation === undefined || otherOccupation === '') {
    var occupation = req.body.occupation;
  } else {
    var occupation = otherOccupation;
  }

  if (othercaste === undefined || othercaste === '') {
    var caste = req.body.caste;
  } else {
    var caste = othercaste;
  }


  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('timestamp', sql.NVarChar, timestamp);
    request.input('Constituency', sql.NVarChar, Constituency);
    request.input('mobile_number', sql.VarChar, mobile_number);
    request.input('gender', sql.NVarChar, gender);
    request.input('urban_or_rural', sql.NVarChar, urban_or_rural);
    request.input('upcoming_election_party', sql.NVarChar, upcoming_election_party);
    request.input('party_2018', sql.NVarChar, party_2018);
    request.input('satisfaction_with_cm', sql.NVarChar, satisfaction_with_cm);
    request.input('satisfaction_with_mla', sql.NVarChar, satisfaction_with_mla);
    request.input('occupation', sql.NVarChar, occupation);
    request.input('caste', sql.NVarChar, caste);
    request.input('agent_id', sql.NVarChar, agent_id);
    request.input('remarks', sql.NVarChar, remarks);

    const query = `
      INSERT INTO SurveyData_form (
        Timestamp,
        Constituency,
        Mobile_Number, 
        Gender, 
        Urban_or_Rural, 
        Upcoming_Election_Party, 
        Party_2018, 
        Satisfaction_with_CM, 
        Satisfaction_with_MLA, 
        Occupation, 
        Caste, 
        Agent_ID, 
        Remarks_if_any
      ) 
      VALUES (
        @timestamp,
        @Constituency,
        @mobile_number, 
        @gender,
        @urban_or_rural, 
        @upcoming_election_party, 
        @party_2018, 
        @satisfaction_with_cm, 
        @satisfaction_with_mla, 
        @occupation, 
        @caste, 
        @agent_id, 
        @remarks
      )`;

    await request.query(query);
    console.log('Data inserted successfully.');
    res.redirect('/');
  } catch (error) {
    console.error(error);
  } finally {
    sql.close();
  }
});


app.get('/SurveyData', async (req, res) => {


  try {
    await sql.connect(config);
    const request = new sql.Request();


    const query = `select * from SurveyData_form`;

    const result = await request.query(query);
    console.log('DataFetched Successfully', result);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
  } finally {
    sql.close();
  }
});


app.get('/constituency', async (req, res) => {


  try {
    await sql.connect(config);
    const request = new sql.Request();


    const query = `select constituency, constituency_name from constituency_user`;

    const result = await request.query(query);
    console.log('DataFetched Successfully', result);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
  } finally {
    sql.close();
  }
});



// Route to fetch constituency options
app.get('/get_constituency_options', async (req, res) => {
  try {
    // Connect to the database
    await sql.connect(config);

    // Query the database
    const result = await sql.query`SELECT value, name FROM ConstituencyOptions WHERE is_active = 1`;

    // Send the JSON response
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching options:', err);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  } finally {
    sql.close();
  }
});


app.get('/update', async (req, res) => {
  try {
    // Get the 'constituency' parameter from the query string
    const constituency = req.query.constituency;
    console.log('Constituency values to update:', constituency);

    // Connect to the database
    await sql.connect(config);
    console.log('Connected to the database.');

    // Form the SQL query
    const query = `UPDATE ConstituencyOptions SET is_active = 1 WHERE value IN (${constituency})`;
    console.log('SQL Query:', query);

    // Update the 'is_active' flag for the specified constituencies
    const result = await sql.query(query);
    // console.log('Update result:', result);

    // Send the JSON response
    res.json({ message: 'Constituencies updated successfully.' });
  } catch (err) {
    console.error('Error updating constituencies:', err);
    res.status(500).json({ error: 'An error occurred while updating constituencies.' });
  } finally {
    sql.close();
  }
});





app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
