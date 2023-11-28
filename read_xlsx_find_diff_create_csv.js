import axios from 'axios';
import fs from 'fs';
import xlsx from 'xlsx'
import { parse } from 'csv-parse';
import { createObjectCsvWriter } from 'csv-writer'


///read excel file and get api response and compare with other json to find diff between response JSON and the outputData Json and create csv file

const workbook = xlsx.readFile('result.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Extract BLAZE_REQUEST values
const data = xlsx.utils.sheet_to_json(sheet, { raw: true }).map(row => JSON.parse(row.BLAZE_REQUEST));

// Define your API URL
const apiUrl = 'https://devapigee.itnext-dev.com/blazehealth/optimaSecure';

// Define your API request configuration
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer TOKEN',
};

// Make individual API requests for each BLAZE_REQUEST
data.forEach((blazeRequest, index) => {
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: apiUrl,
    headers: headers,
    data: blazeRequest,
  };

  axios(config)
    .then(async response => {
      console.log(`API Response for request ${index + 1}:`, response.data);

   ////put your second call blaze api and in placeof OUTPUDATA put it response

      const outputData  = {
        "invocationInfo": {
            "version": "V20231121",
            "strategy": null,
            "sourceApplication": "GC",
            "transactionDate": "2023-08-22T00:00:00.000+0000",
            "blazeRequestTime": "2023-11-24T11:24:05Z",
            "blazeResponseTime": "2023-11-24T11:24:05Z",
            "blazeElapsedTime": "401"
        },
        "callType": "DP_GetProposal",
        "proposalDetails": {
            "transactionType": "ENDORSEMENT",
            "subAgentCode": null,
            "overseasResidenceStatus": null,
            "currentResidenceStatus": null,
            "verticalCode": "101003000",
            "verticalSubCode": "0",
            "agentCode": "200961094781",
            "recommendedQuotesWithRider": "NO",
            "recommendedQuoteHDCRiderSI": 0.0,
            "qcFlag": null,
            "cohortFlag": null,
            "numberOfInstallmentPaid": 3,
            "emiEndorsmentAmount": null,
            "emiProposalAmount": null,
            "installmentAmountPaid": 3475.0,
            "isRecommandedQuoteRequired": null,
            "channel": "INTR-2856-99006196",
            "campaignCode": null,
            "isEmpOfPromoterGroup": false,
            "proposerDetails": {
                "proposerId": "100974547951",
                "dateOfBirth": "1990-10-11T00:00:00.000+0000",
                "age": 32.0,
                "creditScore": null,
                "isVip": false,
                "isRn": false,
                "currentAddress": {
                    "address": "B/13, BASEMENT, VAISHALI INDL. ESTATE",
                    "state": "MAHARASHTRA",
                    "pinCode": "400068",
                    "city": "MUMBAI",
                    "country": "INDIA"
                },
                "permanentAddress": {
                    "address": "B/13, BASEMENT, VAISHALI INDL. ESTATE",
                    "state": "MAHARASHTRA",
                    "pinCode": "400068",
                    "city": "MUMBAI",
                    "country": "INDIA"
                },
                "amountEligibleFor80D": 16594.0,
                "applicableFor80D": false
            },
            "portfolioType": "HEALTH",
            "benefitsDetails": [],
            "proposalPlan": "OptimaSecure",
            "previousPlan": null,
            "typeOfBusiness": "NEW",
            "productCategory": "Health",
            "productCategoryCode": "28",
            "productName": "OptimaSecure",
            "productCode": "myoptimasecure",
            "policyType": "INDIVIDUAL",
            "proposalDate": "2023-10-25T00:00:00.000+0000",
            "expiryDateOfPurchasedPolicy": "2023-08-22T00:00:00.000+0000",
            "numberOfAdults": 1,
            "numberOfChildren": 0,
            "adminCharges": 0.0,
            "cumulativeBonus": null,
            "applicableFor80D": null,
            "multiIndividualDiscountFlag": true,
            "customerGSTIN": null,
            "isOnlineApplication": false,
            "insuredDetails": [
                {
                    "cohortType": null,
                    "zone": "Tier1",
                    "addonDateOfInsured": null,
                    "isMedicallyAdverse": false,
                    "deductableOptedDateFirstTime": null,
                    "isWaiverDeductableOpted": false,
                    "isWaiverDeductableOptedPreviously": false,
                    "isHdcGlobalOpted": null,
                    "cumulativeBonus": null,
                    "baseUrEmiPaidAmount": null,
                    "totalEmiPaidAmount": null,
                    "uwLoadingDetails": [],
                    "customerId": "2023310002868436",
                    "dateOfBirth": "1990-10-11T00:00:00.000+0000",
                    "age": 32,
                    "gender": "M",
                    "nationality": "INDIAN",
                    "visaExpiryDate": null,
                    "currentAddress": {
                        "address": "B/13, BASEMENT, VAISHALI INDL. ESTATE",
                        "state": "MAHARASHTRA",
                        "pinCode": "400068",
                        "city": "MUMBAI",
                        "country": "INDIA"
                    },
                    "permanentAddress": {
                        "address": "B/13, BASEMENT, VAISHALI INDL. ESTATE",
                        "state": "MAHARASHTRA",
                        "pinCode": "400068",
                        "city": "MUMBAI",
                        "country": "INDIA"
                    },
                    "annualIncome": 0.0,
                    "isNewlyAdded": false,
                    "creditScore": null,
                    "applicableFor80D": true,
                    "residenceStatus": null,
                    "occupation": "CASHIER",
                    "blazeDecision": "STP",
                    "relationShipWithProposer": "Self",
                    "heightInCm": 170.0,
                    "weightInKg": 60.0,
                    "bmi": 20.761245674740486,
                    "sumInsured": 1000000.0,
                    "totalBaseLoadingPercentage": 0.0,
                    "totalCILoadingPercentage": 0.0,
                    "uwTotalBaseLoadingPercentage": null,
                    "uwTotalCILoadingPercentage": null,
                    "uwTotalOTSGlobalLoadingPercentage": 0.0,
                    "uwTotalOTSGlobalPlusLoadingPercentage": 0.0,
                    "noOfHealthyWeeksAccumulated": null,
                    "uwTotalHCLoadingPercentage": null,
                    "discountDetails": [],
                    "sumAtRisk": null,
                    "multipleRiskScore": null,
                    "isSTP": true,
                    "isAdult": true,
                    "previousPolicies": [],
                    "portingDetails": [],
                    "originalPolicyDetails": {
                        "companyName": null,
                        "productName": null,
                        "planName": null,
                        "policyType": null,
                        "policyNumber": null,
                        "deductibleAmount": 0.0,
                        "anyPreviousPolicyHasLoading": false,
                        "anyPreviousPolicyHasExclusion": false,
                        "tenure": null,
                        "riders": [],
                        "lob": null,
                        "policyStartDate": null,
                        "policyEndDate": null,
                        "sumInsured": 0.0,
                        "cumulativeBonus": 0.0,
                        "claimDetails": {
                            "noOfClaimsSettled": null,
                            "noOfClaimsMade": null,
                            "noOfClaimsSettledInYear": null
                        },
                        "isContinuedPreviousBenefits": false,
                        "isPolicyMergingAllowed": false,
                        "ridersLength": 0
                    },
                    "cbPercent": 0.0,
                    "recommendedQuotes": [],
                    "recommendedPlanPremiums": [],
                    "currentYearCBAmount": 0.0,
                    "totalCBAmount": 0.0,
                    "lifeStyleHabits": [],
                    "loadingDetails": [],
                    "exclusions": [],
                    "pphcResponse": {
                        "isPPHCTriggered": false,
                        "categoryType": null,
                        "pphcGrid": [],
                        "pphcCost": null,
                        "pphcGridLength": 0
                    },
                    "pphcValues": {
                        "pphcTestResponse": [],
                        "labTestDetails": [],
                        "pphcTestResponseLength": 0,
                        "labTestDetailsLength": 0
                    },
                    "questionsResponse": [],
                    "renewalTests": [],
                    "riders": [
                        {
                            "riderCode": "10833",
                            "riderDescription": "my:health Critical illness Add on",
                            "isHdcGlobalOpted": null,
                            "loadingPerc": null,
                            "hdcIndiaPremiumWithoutGST": 0.0,
                            "hdcGlobalPremiumWithoutGST": 0.0,
                            "hdcIndiaPremium": 0.0,
                            "hdcGlobalPremium": 0.0,
                            "totalHdcPremium": 0.0,
                            "grossPremiumWithoutGST": 163.0,
                            "loadingValue": 0.0,
                            "sumAssured": 100000.0,
                            "hdcGlobalsumAssured": 0.0,
                            "totalEmiPaidAmount": 27.16,
                            "originalSumAssured": null,
                            "premium": 13.5833333333333,
                            "refundAmount": 6.791666666666668,
                            "newPremium": 6.791666666666666,
                            "riderSubPlan": "PLAN1",
                            "isDefault": true,
                            "isOpted": true,
                            "isNewlyAdded": false,
                            "isDeleted": false
                        }
                    ],
                    "requestedPlanPremium": {
                        "quoteId": null,
                        "emiDetails": [],
                        "totalBasePremium": 14063.0,
                        "planName": "OptimaSecure",
                        "basePremium": 13900.0,
                        "baseRefundAmt": 13900.0,
                        "baseRetainAmt": 0.0,
                        "endorsementAmount": 13906.79,
                        "endorsementPremium": 6.79,
                        "totalRiderPremium": 163.0,
                        "totalRiskDiscounts": 0.0,
                        "totalLoadings": 0.0,
                        "totalNonRiskDiscounts": 0.0,
                        "totalGST": 2531.9500000000003,
                        "totalRefundGST": 1251.61,
                        "totalFinalPremium": 16594.34,
                        "grossPremium": 14063.0,
                        "stampDuty": 0.0,
                        "deficitPremium": 0.0,
                        "gst": [
                            {
                                "taxDisplayName": "CGST",
                                "keralaCESS": 0.0,
                                "taxPercentage": 9.0,
                                "taxAmount": 0.61,
                                "refundTaxAmount": 1251.61,
                                "hdfcGSTIN": "27AABCL5045N1Z8",
                                "gstRegisteredAddress": "6thfloor, leelaBusinessPark, AndheriKurlaRoad, Andheri (E), Mumbai - 400059"
                            }
                        ],
                        "discountDetails": [],
                        "loadingDetails": [],
                        "packageDiscountAmt": null,
                        "packageLoadingAmt": null,
                        "unlimitedRestorePremium": null,
                        "hdcTotalRiderPremium": null,
                        "hdcIndiaRiderPremium": null,
                        "hdcGlobalRiderPremium": null,
                        "ipaRiderPremium": null,
                        "otsGlobalRiderPremium": null,
                        "otsGlobalPlusRiderPremium": null,
                        "ciRiderpremium": null,
                        "opRiderpremium": null,
                        "discountDetailsLength": 0,
                        "loadingDetailsLength": 0,
                        "emiDetailsLength": 0,
                        "gstLength": 1
                    },
                    "uwCriteriaData": [],
                    "waitingPeriodDetails": {
                        "waitingPeriodResponse": [],
                        "waitingPeriodRequest": [],
                        "waitingPeriodResponseLength": 0,
                        "waitingPeriodRequestLength": 0
                    },
                    "isDeleted": false,
                    "uwCriteriaDataLength": 0,
                    "recommendedQuotesLength": 0,
                    "recommendedPlanPremiumsLength": 0,
                    "discountDetailsLength": 0,
                    "previousPoliciesLength": 0,
                    "portingDetailsLength": 0,
                    "lifeStyleHabitsLength": 0,
                    "loadingDetailsLength": 0,
                    "exclusionsLength": 0,
                    "questionsResponseLength": 0,
                    "renewalTestsLength": 0,
                    "ridersLength": 1,
                    "uwLoadingDetailsLength": 0
                }
            ],
            "isExceptionalApproval": false,
            "paymentFreq": "MONTHLY",
            "modeOfPayment": "NT",
            "currentPolicyStartDate": "2023-08-22T00:00:00.000+0000",
            "manualDeviationDetails": [],
            "currentPolicyEndDate": "2024-08-21T00:00:00.000+0000",
            "underwritingDecisionDate": null,
            "counterOfferAcceptanceDate": null,
            "loanDisbursalDate": null,
            "proposalSignedDate": null,
            "portabilityExpiryDate": null,
            "policyTenure": 1,
            "sumInsured": 1000000.0,
            "planForRenewal": null,
            "proposalNumber": "202308220003150",
            "newSumInsured": null,
            "sourceState": "MAHARASHTRA",
            "recommendedQuotes": [],
            "isCoPayOpted": false,
            "deductibleSumInsured": 0.0,
            "newDeductibleSumInsured": null,
            "latestPremiumPaidDate": null,
            "premiumAmtPaid": 0.0,
            "terminationType": null,
            "terminationParty": null,
            "terminationDate": null,
            "ppcRefundAmount": null,
            "gracePeriod": null,
            "generalExclusion": [],
            "premiumOutput": {
                "quoteId": null,
                "emiDetails": [],
                "totalBasePremium": 14063.0,
                "planName": "OptimaSecure",
                "basePremium": 13900.0,
                "baseRefundAmt": 13900.0,
                "baseRetainAmt": 0.0,
                "endorsementAmount": 13906.79,
                "endorsementPremium": 6.79,
                "totalRiderPremium": 163.0,
                "totalRiskDiscounts": 0.0,
                "totalLoadings": 0.0,
                "totalNonRiskDiscounts": 0.0,
                "totalGST": 1.22,
                "totalRefundGST": 2503.22,
                "totalFinalPremium": 16594.0,
                "grossPremium": 14063.0,
                "stampDuty": 0.0,
                "deficitPremium": 0.0,
                "gst": [
                    {
                        "taxDisplayName": "SGST",
                        "keralaCESS": 0.0,
                        "taxPercentage": 9.0,
                        "taxAmount": 0.61,
                        "refundTaxAmount": 1251.61,
                        "hdfcGSTIN": "27AABCL5045N1Z8",
                        "gstRegisteredAddress": "6thfloor, leelaBusinessPark, AndheriKurlaRoad, Andheri (E), Mumbai - 400059"
                    },
                    {
                        "taxDisplayName": "SGST",
                        "keralaCESS": 0.0,
                        "taxPercentage": 9.0,
                        "taxAmount": 0.61,
                        "refundTaxAmount": 1251.61,
                        "hdfcGSTIN": "27AABCL5045N1Z8",
                        "gstRegisteredAddress": "6thfloor, leelaBusinessPark, AndheriKurlaRoad, Andheri (E), Mumbai - 400059"
                    }
                ],
                "discountDetails": [],
                "loadingDetails": [],
                "packageDiscountAmt": null,
                "packageLoadingAmt": null,
                "unlimitedRestorePremium": null,
                "hdcTotalRiderPremium": null,
                "hdcIndiaRiderPremium": null,
                "hdcGlobalRiderPremium": null,
                "ipaRiderPremium": null,
                "otsGlobalRiderPremium": null,
                "otsGlobalPlusRiderPremium": null,
                "ciRiderpremium": null,
                "opRiderpremium": null,
                "discountDetailsLength": 0,
                "loadingDetailsLength": 0,
                "emiDetailsLength": 0,
                "gstLength": 2
            },
            "recommendedPlanPremiums": [],
            "claimsDetail": {
                "noOfClaimsSettled": 0,
                "noOfClaimsMade": 0,
                "noOfClaimsSettledInYear": 0
            },
            "endorsementDetails": {
                "endorsementType": "NOTNIL",
                "endorsementEffectiveDate": "2023-10-25T00:00:00.000+0000",
                "typeOfCalculation": "PRO_RATA",
                "refundDetails": "FULL",
                "cancellationType": "WRONG_DATA_ENTRY",
                "endorsementRequestType": "2",
                "initiator": "HEGI"
            },
            "discountDetails": [],
            "documentsReceived": [],
            "isMultiPolicyMergeRequest": false,
            "newRiskStartDate": null,
            "isExceptionallyApproved": null,
            "packageDiscount": null,
            "packageLoading": null,
            "isEmiOpted": true,
            "manualDeviationDetailsLength": 0,
            "recommendedQuotesLength": 0,
            "generalExclusionLength": 0,
            "recommendedPlanPremiumsLength": 0,
            "discountDetailsLength": 0,
            "documentsReceivedLength": 0,
            "benefitsDetailsLength": 0,
            "insuredDetailsLength": 1
        },
        "policyDecision": {
            "systemDecision": "Reject - System",
            "messages": [],
            "gcDecision": "REJECT",
            "isSTP": false,
            "systemDecisionDate": "2023-11-23T18:30:00.000+0000",
            "finalApprovalLevel": "Level-4-Permanent",
            "ruleAudits": [],
            "uwCriteriaData": [
                {
                    "reasonCode": "KN_009",
                    "decision": "Reject - System",
                    "reasonText": "Transactions not allowed for EMI Cancellation-Endorsement",
                    "category": "Plan Change",
                    "escalationLevel": null,
                    "insuredId": null,
                    "appliesTo": "PROPOSAL",
                    "icdCode": null
                }
            ],
            "calculatedVariables": [],
            "ruleAuditsLength": 0,
            "uwCriteriaDataLength": 1,
            "calculatedVariablesLength": 0,
            "messagesLength": 0
        },
        "responseStatus": "SUCCESS",
        "error": [],
        "errorLength": 0
    }

      const differences = await findDifferences(response.data, outputData);



       //create csv file
       const csvWriter = createObjectCsvWriter({
        path: 'new_output.csv',
        header: [
          
          { id: 'path', title: 'Key' },
          { id: 'value1', title: 'Value 1' },
          { id: 'value2', title: 'Value 2' },
          { id: 'value3', title: 'Value 3' },
        ],
        append: true, 
        });
      
        // Check if the file already exists
        const fileExists = fs.existsSync('new_output.csv');
        // If the file doesn't exist, add the title row
        if (!fileExists) {
          fs.appendFileSync('new_output.csv', 'KEY,optima_api_value,callblaze_api_value,type\n');
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
          value1: record.value1,
          value2: record.value2,
          value3: record.value3
       };
    }
  })
    .catch(error => {
      console.error(`API Error for request ${index + 1}:`, error.response ? error.response.data : error.message);
    });
});



function findDifferences(obj1, obj2, path = []) {

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
      const subDifferences = findDifferences(val1, val2, [...path, key]);
      differences.push(...subDifferences);
    } else if (val1 !== val2) {
      differences.push({
        path: [...path, key],
        value1: val1,
        value2: val2,
        value3: false
      });
    }
    else if (val1 == val2) {
        differences.push({
          path: [...path, key],
          value1: val1,
          value2: val2,
          value3: true
        });
      }
  }

  return differences;
}







