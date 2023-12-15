import axios from 'axios';
import fs from 'fs';
import xlsx from 'xlsx'
import { parse } from 'csv-parse';
import { createObjectCsvWriter } from 'csv-writer';
import { performance } from 'perf_hooks';


///read excel file and get api response and compare with other json to find diff between response JSON and the outputData Json and create csv file

const workbook = xlsx.readFile('new_data.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Extract BLAZE_REQUEST values
const data = xlsx.utils.sheet_to_json(sheet, { raw: true }).map(row => JSON.parse(row.blaze_request));

// // Extract BLAZE_RESPONSE values
const data_res = xlsx.utils.sheet_to_json(sheet, { raw: true }).map(row => {
  try {
      return JSON.parse(row.blaze_response);
  } catch (error) {
      console.error(`Error parsing blaze_response data:`, error.message);
      console.error(`Problematic data:`, row.blaze_response);
      return null; 
  }
});


// Define your API URL
const apiUrl = 'https://devapigee.itnext-dev.com/blaze/fico-hdfc-ergo-hi-blaze-ds-ws/blaze-health-insurance-ds-api/decision';

// Define your API request configuration
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJoZGZjLWVyZ28tdXNlciIsImNsaWVudGlkIjoidWdpd1ROREUwZ2VYS0lWREIwRzk3dWx4NU5BSGlBbTRyWFpLNGdPWGFJeFpIWDU5IiwiaXNzIjoidXJuOi8vYXBpZ2VlLUpXVC1wb2xpY3kiLCJleHAiOjE3MDI2MzY1MTksImlhdCI6MTcwMjYxNDkxOSwianRpIjoiNGU0ZDU4MzctNGM5Yi00MTU3LTkyMDMtNjgyOTY1NmNlZmViIn0.hyCyjYP7B4XjOTeK1gwzyoRpBDUmXsZEhJdu52MiErs',
};

// Make individual API requests for each BLAZE_REQUEST
data.forEach((blazeRequest, index) => {
    const startTime = performance.now();
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: apiUrl,
    headers: headers,
    data: blazeRequest,
  };

  axios(config)
    .then(async response => {
     
   
      const endTime = performance.now();

      const responseTime =  formatElapsedTime(endTime - startTime);

   ////put your second call blaze api and in placeof OUTPUDATA put it response

      const outputData  =  data_res[index];
     
      if (outputData && Object.keys(outputData).length > 0) {
        // const outputDataJson = JSON.parse(outputData);
      const differences = await findDifferences(response.data, outputData,responseTime);



       //create csv file
       const csvWriter = createObjectCsvWriter({
        path: 'new_data_output.csv',
        header: [
          
          { id: 'path', title: 'Key' },
          { id: 'value1', title: 'Value 1' },
          { id: 'value2', title: 'Value 2' },
          { id: 'value3', title: 'Value 3' },
          { id: 'value4', title: 'Value 4' },
        ],
        append: true, 
        });
      
        // Check if the file already exists
        const fileExists = fs.existsSync('new_data_output.csv');
        // If the file doesn't exist, add the title row
        if (!fileExists) {
          fs.appendFileSync('new_data_output.csv', 'KEY,api_response_value,data_response_value,type, Response Time\n');
        }

         csvWriter.writeRecords(differences.map(transformRecord))
         .then(() => {
         console.log('CSV file written successfully');
        })
         .catch((err) => console.error(err));

         function transformRecord(record) {
// Customize values before writing to the CSV file
         return {
          path: record.path.join('_'),  
          value1: stringifyValue(record.value1),
          value2: stringifyValue(record.value2),
          value3: record.value3,
          value4: record.value4
       };
    }


   
      function stringifyValue(value) {
       if (typeof value === 'object') {
        return JSON.stringify(value);
       }
       return value;
       }
      }else {
        console.error(`Error: blaze_response data is empty or not valid JSON for request ${index + 1}`);
      }



  })
    .catch(error => {
      console.error(`API Error for request ${index + 1}:`, error.response ? error.response.data : error.message);
    });
});


function formatElapsedTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
  
    const formattedTime = `${pad(hours)}:${pad(minutes % 60)}:${pad(seconds % 60)}`;
    return formattedTime;
  }
  
 
  function pad(number) {
    return number < 10 ? `0${number}` : `${number}`;
  }


function findDifferences(obj1, obj2,responseTime, path = []) {
  

  if (obj1 === null || obj1 === undefined || obj2 === null || obj2 === undefined) {
      return [];
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const differences = [];

  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (typeof val1 === "object" && typeof val2 === "object") {
      const subDifferences = findDifferences(val1, val2,responseTime, [...path, key]);
      differences.push(...subDifferences);
    } else if (val1 !== val2) {
      differences.push({
        path: [...path, key],
        value1: val1,
        value2: val2,
        value3: false,
        value4: responseTime
      });
    }
    else if (val1 == val2) {
        differences.push({
          path: [...path, key],
          value1: val1,
          value2: val2,
          value3: true,
          value4: responseTime
        });
      }
  }

  return differences;
}

