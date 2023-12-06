import fs from 'fs';
import xlsx from 'xlsx';
import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import { Client } from '@googlemaps/google-maps-services-js';
const client = new Client();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
//////code to read large xlsx file data in chunks 
const apiKey = 'AIzaSyAQNegGRyWEBuF9g9kgzvjhrxS-SnRb6ns';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 80 * 1024 * 1024,
  },
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const fileBuffer = req.file.buffer;
  const base64String = fileBuffer.toString('base64');

  // Decode the base64 string to a Buffer
  const base64Buffer = Buffer.from(base64String, 'base64');

  const workbook = xlsx.read(base64Buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet['D1'] || worksheet['D1'].v !== 'Consolidated Address') {
    return res.status(400).json({ message: 'The "Consolidated Address" column is missing in the uploaded file.' });
  } else {
    // Convert sheet to JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Batch processing
    const batchSize = 100;
    for (let i = 0; i < jsonData.length; i += batchSize) {
      const batch = jsonData.slice(i, i + batchSize);

      // Process the batch
      const geocodePromises = batch.map(async (data) => {
        const fullAddress = data['Consolidated Address'];
        if (fullAddress !== '' && fullAddress !== null) {
          try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${fullAddress}&key=${apiKey}`);
            const json = response.data;
            if (json.status === 'OK' && json.results.length !== 0) {
              data['Latitude'] = json.results[0].geometry.location.lat;
              data['Longitude'] = json.results[0].geometry.location.lng;
            } else {
              console.error(`Error in Geocoding API response: ${json.status}`);
            }
          } catch (error) {
            console.error(`Error geocoding address: ${fullAddress}`, error.message);
          }
        }
      });

      // Wait for all geocoding promises in the batch to resolve
      await Promise.all(geocodePromises);

      // Introduce a delay between batches
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      await delay(1000); // Adjust the delay as needed
    }

    // Create new excel file
    const newWb = xlsx.utils.book_new();
    const newShe = xlsx.utils.json_to_sheet(jsonData);
    await xlsx.utils.book_append_sheet(newWb, newShe, 'address');
    
    // File name
    const filename = "3.9L-4L.xlsx";
    // workbook options
    const wb_opts = { bookType: 'xlsx', type: 'binary' };
    // write workbook file
    await xlsx.writeFile(newWb, filename, wb_opts);
    // create read stream
    const stream = fs.createReadStream(filename);
    // send to client
    stream.pipe(res);
  }
});

app.listen(3003, () => {
  console.log("listening to port");
});
