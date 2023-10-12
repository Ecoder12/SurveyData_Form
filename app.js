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

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('form');
});

app.post('/submit', async (req, res) => {
  const { 
    timestamp, 
    mobile_number, 
    mobile, 
    gender, 
    residence, // Add the new fields here
    constituency,
    urban_or_rural,
    upcoming_election_party,
    party_2018,
    satisfaction_with_cm,
    satisfaction_with_mla,
    occupation,
    caste,
    agent_id,
    remarks,
  } = req.body;

  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('timestamp', sql.NVarChar, timestamp);
    request.input('mobile_number', sql.VarChar, mobile_number);
    request.input('mobile', sql.VarChar, mobile);
    request.input('gender', sql.NVarChar, gender);
    request.input('residence', sql.NVarChar, residence); // Add the new fields here
    request.input('constituency', sql.NVarChar, constituency);
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
        Mobile_Number, 
        MOBILE, 
        Gender, 
        Residence, 
        Constituency, 
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
        @mobile_number, 
        @mobile, 
        @gender, 
        @residence, 
        @constituency, 
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



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
