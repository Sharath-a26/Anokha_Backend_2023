const https = require('https');
const csv = require('csv-parser');
const mysql = require('mysql');
const url = 'https://raw.githubusercontent.com/JacobSamro/colleges-api/master/db/database.csv';

const insertCollegeData = (db) =>{
https.get(url, (response) => {
    response
      .pipe(csv())
      .on('data', (data) => {
        
        const query = 'INSERT INTO CollegeData (universityName, collegeName, district, state, country) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [data["University Name"], data["College Name"], data["District Name"], data["State Name"],'INDIA'], (error, results, fields) => {
          if (error) throw error;
          console.log('Data inserted into MySQL table');
        });
      })
      .on('end', () => {
        console.log('CSV file processed successfully');
        // Close the MySQL connection
        
      });
  }).on('error', (error) => {
    console.error(error);
  });
}
module.exports = insertCollegeData;