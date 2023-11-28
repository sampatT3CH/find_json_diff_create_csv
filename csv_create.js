

  import fs from 'fs';
  import axios from 'axios';
  import { createObjectCsvWriter } from 'csv-writer';


  //read the file inputjson for api
  fs.readdirSync('./Health/').forEach(file => {

      const filenames = []
      const inputPrefix = "InputJson_";
      const outputPrefix = "OutputJson_";
      const prefix = file.startsWith(inputPrefix) ? inputPrefix : outputPrefix;
      //to get file id for eg: InputJson_12345_1235.txt as 12345_1235.txt to match with outputjson with similar id and compare json difference
      let result = file.substring(prefix.length);

      result = result.replace(".txt", "");

      const resultBuffer = fs.readFileSync('./Health/' + file);
      const resultData = JSON.parse(resultBuffer.toString().trim());
      let data = JSON.stringify(resultData);

      let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://devapigee.itnext-dev.com/blazehealth/optimaSecure',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJoZGZjLWVyZ28tdXNlciIsImNsaWVudGlkIjoiMmVzY0xBZFFXMnFyMzdFMDN1QUlPY1dBcEM2R0VLanhWYmlQajVJR1M3eldSWUQ2IiwiaXNzIjoidXJuOi8vYXBpZ2VlLUpXVC1wb2xpY3kiLCJleHAiOjE3MDA4MjI0MDQsImlhdCI6MTcwMDgwMDgwNCwianRpIjoiOTQyY2YwMDAtODU3Ni00YjYyLWJkZTctZjVjZmYyZTVlNTFiIn0.UKBGhMJdDzVws7DZ_a11JVSh20hHI8XTu0tz-2Oo7bw'
          },
          data: data
      };
     //read inputjson response and match same with outputjson id file and find diff in json
      axios.request(config)
          .then(async (response) => {
          
              const outputBuffer = fs.readFileSync(`./Health/OutputJson_${result}.txt`);
              const outputData = JSON.parse(outputBuffer.toString().trim());
              const differences = await findDifferences(response.data, outputData,result);
              //create csv file
              const csvWriter = createObjectCsvWriter({
                path: 'output.csv',
                header: [
                  
                  { id: 'path', title: 'Key' },
                  { id: 'value1', title: 'API_VALUE' },
                  { id: 'value2', title: 'OUTPUT_FILE_VALUE' },
                  { id: 'value3', title: 'FILE_ID' },
                ],
                append: true, 
              });
              
              // Check if the file already exists
              const fileExists = fs.existsSync('output.csv');
              // If the file doesn't exist, add the title row
              if (!fileExists) {
                  fs.appendFileSync('output.csv', 'KEY,RESPONSE_VALUE,OUTPUT_FILE_VALUE,FILE_ID\n');
              }

              csvWriter.writeRecords(differences.map(transformRecord), result)
                 .then(() => {
                 console.log('CSV file written successfully');
              })
                 .catch((err) => console.error(err));

  function transformRecord(record) {
    // Customize values before writing to the CSV file
    return {
      path: record.path.join('_'),  
      value1: record.value1,
      value2: record.value2,
    };
  }})
    .catch((error) => {
        console.log(error);
    });
});


//json find difference code
  function findDifferences(obj1, obj2,result, path = []) {

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
          const subDifferences = findDifferences(val1, val2,result, [...path, key]);
          differences.push(...subDifferences);
        } else if (val1 !== val2) {
          differences.push({
            path: [...path, key],
            value1: val1,
            value2: val2,
            value3: result
          });
        }
      }
    
      return differences;
    }


  






    