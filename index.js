  import fs from 'fs';
  import xlsx from 'xlsx';
  import fetch from 'node-fetch';
  import express from 'express';
  import bodyParser from 'body-parser';
  import cors from 'cors';
  import multer from 'multer';
  import path from 'path';
  import csv from 'csv-parser';
  import download from 'download'
  import { Client } from '@googlemaps/google-maps-services-js';
  const client = new Client();

  const app = express();


  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors());



  const apiKey = 'GOOGLE-MAP-API-KEY'; 

  const storage = multer.memoryStorage();
  const upload = multer({ storage });



  app.post('/upload', upload.single('file'), async (req, res) => {

    const fileBuffer = req.file.buffer; 
  const base64String = fileBuffer.toString('base64');


  const base64Buffer = Buffer.from(base64String, 'base64');




  const workbook = xlsx.read(base64Buffer, { type: 'buffer' });

  const sheetName = workbook.SheetNames[0];

  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet['F1'] || worksheet['F1'].v !== 'Consolidated Address') {
    return res.status(400).json({ message: 'The "Consolidated Address" column is missing in the uploaded file.' });
  }

  for (const addressCell in worksheet) {
    if ( worksheet[addressCell].v !== 'Consolidated Address') {
      const fullAddress = worksheet[addressCell].v;
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`;

      fetch(geocodeUrl)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error('Failed to fetch data');
          }
        })
        .then(async (data) => {
          if (data.status === 'OK') {
            const result  = data.results[0].geometry.location;
            const latitude = result .lat;
            const longitude = result .lng;

            // Update the Excel sheet with latitude and longitude
            const addressCellRow = addressCell.substring(1);
            const latitudeCell = `G${addressCellRow}`;
            const longitudeCell = `H${addressCellRow}`;

            worksheet[latitudeCell] = { v: latitude };
            worksheet[longitudeCell] = { v: longitude };

            const modifiedFilePath = 'updated_addresses.xlsx';
            await new Promise((resolve, reject) => {
              xlsx.writeFile(workbook, modifiedFilePath, (err) => {
                if (err) reject(err);
                else resolve();
              });
            });

          } else {
            console.error('Error');
          }
        })
        .catch((error) => {
          console.error('Error', error);
        });
    }
  }
  });


///passing file from frontend to backend
  // const fileInput = document.getElementById('myfile');
  //     console.log(fileInput)
  //         const file = fileInput.files[0];
  //         if (file) {
  //             const formData = new FormData();
  //             formData.append('file', file);

  //             // Send the formData to the backend using the Fetch API
  //             fetch('http://localhost:3000/upload', {
  //                 method: 'POST',
  //                 body: formData
  //             }) 


  app.listen(3000, () => {
    console.log("listening to port")
  })