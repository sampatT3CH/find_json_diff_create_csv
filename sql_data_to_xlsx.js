import mysql from 'mysql2';
import XLSX from 'xlsx';

// const storage = multer.memoryStorage();
//   const upload = multer({ storage });

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sampat',
  database: 'sampatdb',
});

const queryDatabaseFor_gahp_insured_details = (index) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM gahp_insured_details WHERE insured_lead_no = ${index + 1}`, (error, results, fields) => {
      if (error) {
        console.error('Error executing query for gahp_insured_details:', error);
        reject(error);
      } else {
        // console.log('Fetched data for gahp_insured_details:', results);
        resolve(results);
      }
    });
  });
};


const queryDatabaseFor_gahp_details = (index) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM gahp_details WHERE lead_no = ${index + 1}`, (error, results, fields) => {
      if (error) {
        console.error('Error executing query for gahp_insured_details:', error);
        reject(error);
      } else {
        // console.log('Fetched data for gahp_insured_details:', results);
        resolve(results);
      }
    });
  });
};

const insertIntoHistoryTable1 = (id, type) => {
  return new Promise((resolve, reject) => {
    const insertQuery = 'INSERT INTO history (`key`, created_time, updated_time, type) VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)';

    connection.query(insertQuery, [id, type], (error, results, fields) => {
      if (error) {
        console.error('Error inserting into history table:', error);
        reject(error);
      } else {
        console.log('Inserted into history table');
        resolve();
      }
    });
  });
};


const insertIntoHistoryTable2 = (id, type) => {
  return new Promise((resolve, reject) => {
    const insertQuery = 'INSERT INTO history (`key`, created_time, updated_time, type) VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)';

    connection.query(insertQuery, [id, type], (error, results, fields) => {
      if (error) {
        console.error('Error inserting into history table:', error);
        reject(error);
      } else {
        console.log('Inserted into history table');
        resolve();
      }
    });
  });
};


const runScript = async () => {
  const workbook = XLSX.utils.book_new();
  const allRows = [];
 
  try {
    // gahp_insured_details
    for(let i =0; i < 6; i++){
      const res_gahp_insured_details = await queryDatabaseFor_gahp_insured_details(i);
      const res_gahp_details = await queryDatabaseFor_gahp_details(i);
       await insertIntoHistoryTable1(res_gahp_insured_details[i]?.insured_id || "", 'gahp_insured_details');
       await insertIntoHistoryTable2(res_gahp_details[0]?.lead_no || "", 'gahp_details');
      
      
     const col_data = {
           'LeadNo': res_gahp_details[0]?.lead_no || '',
          'LeadID': res_gahp_details[0]?.lead_id || '',
          'Employee Code':'',
          'LG Code': res_gahp_details[0]?.lg_code || '',
          'LC Code': res_gahp_details[0]?.lc_code || '',
          'Branch code': res_gahp_details[0]?.branch_code || '',
          'Vertical': res_gahp_details[0]?.vertical || '',
          'SubChannel': res_gahp_details[0]?.subchannel || '',
          'Proposer Salutation': res_gahp_details[0]?.salutation || '',
          'Proposer First Name': res_gahp_details[0]?.first_name || '',
          'Proposer Last Name': res_gahp_details[0]?.last_name || '',
          'Proposer DOB': res_gahp_details[0]?.dob || '',
          'Proposer Gender': res_gahp_details[0]?.gender || '',
          'Mobile No': res_gahp_details[0]?.mobile_no || '',
          'Email': res_gahp_details[0]?.email || '',
          'Pancard': res_gahp_details[0]?.pancard || '',
          'Address 1': res_gahp_details[0]?.address_1 || '',
          'Address 2': res_gahp_details[0]?.address_2 || '',
          'Address 3': res_gahp_details[0]?.address_3 || '',
          'Area': res_gahp_details[0]?.area || '',
          'City': res_gahp_details[0]?.city || '',
          'State': res_gahp_details[0]?.state || '',
          'Pincode': res_gahp_details[0]?.pincode || '',
          'Product': res_gahp_details[0]?.product || '',
          'Plan': res_gahp_details[0]?.plan || '',
          'Policy Type': res_gahp_details[0]?.policy_type || '',
          'Family Type': res_gahp_details[0]?.family_type || '',
          'Type Of Business': res_gahp_details[0]?.type_of_business || '',
          'Premium': res_gahp_details[0]?.premium || '',
          'SumInsured': res_gahp_details[0]?.suminsured || '',
          'Total Premium': res_gahp_details[0]?.total_premium || '',
          'Total SumInsured': res_gahp_details[0]?.total_suminsured || '',
          'Insured 1 Relationship': res_gahp_insured_details[0]?.insured_relationship || '',
          'Insured 1 Name': res_gahp_insured_details[0]?.insured_name || '',
          'Insured 1 DOB': res_gahp_insured_details[0]?.insured_dob || '',
          'Insured 1 Gender': res_gahp_insured_details[0]?.insured_gender || '',
          'Insured 1 PedDetails': res_gahp_insured_details[0]?.insured_peddetails || '',
          'Insured 1 SI': res_gahp_insured_details[0]?.insured_si || '',
          'Insured 1 Height': res_gahp_insured_details[0]?.insured_height || '',
          'Insured 1 weight': res_gahp_insured_details[0]?.insured_weight || '',
          'Insured 1 Pre_existing_Disease': res_gahp_insured_details[0]?.insured_pre_existing_disease || '',
          'Insured 1 Policy_Inception_Date': res_gahp_insured_details[0]?.insured_policy_inception_date || '',
          'Insured 1 Nominee Name': res_gahp_insured_details[0]?.insured_nominee_name || '',
          'Insured 1 Relationship Nominee': res_gahp_insured_details[0]?.insured_relationship_nominee || '',
          'Insured 1 Age': res_gahp_insured_details[0]?.insured_age || '',
          'Insured 1 Marital Status': res_gahp_insured_details[0]?.insured_marital_status || '',
          'Insured 1 Dependent': res_gahp_insured_details[0]?.insured_dependent || '',
          'Insured 2 Relationship': res_gahp_insured_details[1]?.insured_relationship || '',
          'Insured 2 Name': res_gahp_insured_details[1]?.insured_name || '',
          'Insured 2 DOB': res_gahp_insured_details[1]?.insured_dob || '',
          'Insured 2 Gender': res_gahp_insured_details[1]?.insured_gender || '',
          'Insured 2 PedDetails': res_gahp_insured_details[1]?.insured_peddetails || '',
          'Insured 2 SI': res_gahp_insured_details[1]?.insured_si || '',
          'Insured 2 Height': res_gahp_insured_details[1]?.insured_height || '',
          'Insured 2 weight': res_gahp_insured_details[1]?.insured_weight || '',
          'Insured 2 Pre_existing_Disease': res_gahp_insured_details[1]?.insured_pre_existing_disease || '',
          'Insured 2 Policy_Inception_Date': res_gahp_insured_details[1]?.insured_policy_inception_date || '',
          'Insured 2 Nominee Name': res_gahp_insured_details[1]?.insured_nominee_name || '',
          'Insured 2 Relationship Nominee': res_gahp_insured_details[1]?.insured_relationship_nominee || '',
          'Insured 2 Age': res_gahp_insured_details[1]?.insured_age || '',
          'Insured 2 Marital Status': res_gahp_insured_details[1]?.insured_marital_status || '',
          'Insured 2 Dependent': res_gahp_insured_details[1]?.insured_dependent || '',
          'Insured 3 Relationship': res_gahp_insured_details[2]?.insured_relationship || '',
          'Insured 3 Name': res_gahp_insured_details[2]?.insured_name || '',
          'Insured 3 DOB': res_gahp_insured_details[2]?.insured_dob || '',
          'Insured 3 Gender': res_gahp_insured_details[2]?.insured_gender || '',
          'Insured 3 PedDetails': res_gahp_insured_details[2]?.insured_peddetails || '',
          'Insured 3 SI': res_gahp_insured_details[2]?.insured_si || '',
          'Insured 3 Height': res_gahp_insured_details[2]?.insured_height || '',
          'Insured 3 weight': res_gahp_insured_details[2]?.insured_weight || '',
          'Insured 3 Pre_existing_Disease': res_gahp_insured_details[2]?.insured_pre_existing_disease || '',
          'Insured 3 Policy_Inception_Date': res_gahp_insured_details[2]?.insured_policy_inception_date || '',
          'Insured 3 Nominee Name': res_gahp_insured_details[2]?.insured_nominee_name || '',
          'Insured 3 Relationship Nominee': res_gahp_insured_details[2]?.insured_relationship_nominee || '',
          'Insured 3 Age': res_gahp_insured_details[2]?.insured_age || '',
          'Insured 3 Marital Status': res_gahp_insured_details[2]?.insured_marital_status || '',
          'Insured 3 Dependent': res_gahp_insured_details[2]?.insured_dependent || '',
          'Insured 4 Relationship': res_gahp_insured_details[3]?.insured_relationship || '',
          'Insured 4 Name': res_gahp_insured_details[3]?.insured_name || '',
          'Insured 4 DOB': res_gahp_insured_details[3]?.insured_dob || '',
          'Insured 4 Gender': res_gahp_insured_details[3]?.insured_gender || '',
          'Insured 4 PedDetails': res_gahp_insured_details[3]?.insured_peddetails || '',
          'Insured 4 SI': res_gahp_insured_details[3]?.insured_si || '',
          'Insured 4 Height': res_gahp_insured_details[3]?.insured_height || '',
          'Insured 4 weight': res_gahp_insured_details[3]?.insured_weight || '',
          'Insured 4 Pre_existing_Disease': res_gahp_insured_details[3]?.insured_pre_existing_disease || '',
          'Insured 4 Policy_Inception_Date': res_gahp_insured_details[3]?.insured_policy_inception_date || '',
          'Insured 4 Nominee Name': res_gahp_insured_details[3]?.insured_nominee_name || '',
          'Insured 4 Relationship Nominee': res_gahp_insured_details[3]?.insured_relationship_nominee || '',
          'Insured 4 Age': res_gahp_insured_details[3]?.insured_age || '',
          'Insured 4 Marital Status': res_gahp_insured_details[3]?.insured_marital_status || '',
          'Insured 4 Dependent': res_gahp_insured_details[3]?.insured_dependent || '',
          'Insured 5 Relationship': res_gahp_insured_details[4]?.insured_relationship || '',
          'Insured 5 Name': res_gahp_insured_details[4]?.insured_name || '',
          'Insured 5 DOB': res_gahp_insured_details[4]?.insured_dob || '',
          'Insured 5 Gender': res_gahp_insured_details[4]?.insured_gender || '',
          'Insured 5 PedDetails': res_gahp_insured_details[4]?.insured_peddetails || '',
          'Insured 5 SI': res_gahp_insured_details[4]?.insured_si || '',
          'Insured 5 Height': res_gahp_insured_details[4]?.insured_height || '',
          'Insured 5 weight': res_gahp_insured_details[4]?.insured_weight || '',
          'Insured 5 Pre_existing_Disease': res_gahp_insured_details[4]?.insured_pre_existing_disease || '',
          'Insured 5 Policy_Inception_Date': res_gahp_insured_details[4]?.insured_policy_inception_date || '',
          'Insured 5 Nominee Name': res_gahp_insured_details[4]?.insured_nominee_name || '',
          'Insured 5 Relationship Nominee': res_gahp_insured_details[4]?.insured_relationship_nominee || '',
          'Insured 5 Age': res_gahp_insured_details[4]?.insured_age || '',
          'Insured 5 Marital Status': res_gahp_insured_details[4]?.insured_marital_status || '',
          'Insured 5 Dependent': res_gahp_insured_details[4]?.insured_dependent || '',
          'Insured 6 Relationship': res_gahp_insured_details[5]?.insured_relationship || '',
          'Insured 6 Name': res_gahp_insured_details[5]?.insured_name || '',
          'Insured 6 DOB': res_gahp_insured_details[5]?.insured_dob || '',
          'Insured 6 Gender': res_gahp_insured_details[5]?.insured_gender || '',
          'Insured 6 PedDetails': res_gahp_insured_details[5]?.insured_peddetails || '',
          'Insured 6 SI': res_gahp_insured_details[5]?.insured_si || '',
          'Insured 6 Height': res_gahp_insured_details[5]?.insured_height || '',
          'Insured 6 weight': res_gahp_insured_details[5]?.insured_weight || '',
          'Insured 6 Pre_existing_Disease': res_gahp_insured_details[5]?.insured_pre_existing_disease || '',
          'Insured 6 Policy_Inception_Date': res_gahp_insured_details[5]?.insured_policy_inception_date || '',
          'Insured 6 Nominee Name': res_gahp_insured_details[5]?.insured_nominee_name || '',
          'Insured 6 Relationship Nominee': res_gahp_insured_details[5]?.insured_relationship_nominee || '',
          'Insured 6 Age': res_gahp_insured_details[5]?.insured_age || '',
          'Insured 6 Marital Status': res_gahp_insured_details[5]?.insured_marital_status || '',
          'Insured 6 Dependent': res_gahp_insured_details[5]?.insured_dependent || '',
          'Proposal Date': res_gahp_details[0]?.proposal_date || '',
          'Policy Start Date': res_gahp_details[0]?.policy_start_date || '',
          'Policy End Date': res_gahp_details[0]?.policy_end_date || '',
          'OfflineQuoteNo': res_gahp_details[0]?.offline_quote_no || '',
          'MasterPolicyNumber': res_gahp_details[0]?.master_policy_number || '',
          'Channel Number': res_gahp_details[0]?.channel_number || '',
          'Risk Location Add Line 1': '',
          'Risk Location Add Line 2': '',
          'Risk Location Add Line 3': '',
          'Permanent_City': res_gahp_details[0]?.permanent_city || '',
          'Permanent_Pincode': res_gahp_details[0]?.permanent_pincode || '',
          'Permanent_State': res_gahp_details[0]?.permanent_state || '',
          'BUSINESS_LOCATION': res_gahp_details[0]?.business_location || '',
          'INTERMEDIARY_ID': res_gahp_details[0]?.intermediary_id || '',
          'BUSINESS_TYPE': res_gahp_details[0]?.business_type || '',
          'PAYER_TYPE': res_gahp_details[0]?.payer_type || '',
          'MODE_OF_ENTRY': res_gahp_details[0]?.mode_of_entry || '',
          'PAYMENT_MODE': res_gahp_details[0]?.payment_mode || '',
          'CHEQUE_TYPE': res_gahp_details[0]?.cheque_type || '',
          'PAYMENT_TYPE': res_gahp_details[0]?.payment_type || '',
          'CHEQUE_DATE': res_gahp_details[0]?.cheque_date || '',
          'CHEQUE_NUM_OR_TRANS_ID': res_gahp_details[0]?.cheque_num_or_trans_id || '',
          'PAYMENT_AMOUNT': res_gahp_details[0]?.payment_amount || '',
          'BANK_NAME': res_gahp_details[0]?.bank_name || '',
          'BRANCH_NAME': res_gahp_details[0]?.branch_name || '',
          'REMARKS': res_gahp_details[0]?.remarks || '',
          'UNIQUE_ID': res_gahp_details[0]?.unique_id || '',
          'Payment Id': res_gahp_details[0]?.payment_id || ''
     }
     allRows.push(col_data);
   
        
    }

const worksheet = XLSX.utils.json_to_sheet(allRows);
XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

const filePath = 'output.xlsx';
XLSX.writeFile(workbook, filePath);

console.log(`XLSX file created: ${filePath}`);
  
     
   

     
    connection.end((err) => {
      if (err) {
        console.error('Error closing connection:', err);
        throw err;
      }
      console.log('Connection closed');
    });

    console.log('Script execution completed');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

runScript();
