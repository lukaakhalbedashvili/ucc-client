// import fs from "fs";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey,
// });

// // Load your debtor data
// // const dataFilePath = path.join(__dirname, "../not_included_companies.json");
// const debtorData = JSON.parse(
//   fs.readFileSync(
//     "/Users/lukaakhalbedashvili/Desktop/ucc-client/not_included_companies.json",
//     "utf8"
//   )
// );

// // Split debtor data into batches of 50
// const batchSize = 100;
// const numBatches = Math.ceil(1000 / batchSize); // Process first 1000 items in batches
// // const numBatches = 1;

// // Function to append data to a file
// function appendToFile(filePath: string, data: string) {
//   fs.appendFileSync(filePath, data, "utf8");
// }

// async function analyzeDebtorsBatch(
//   debtorsBatch: {
//     name: string;
//     email: string;
//   }[],
//   batchNumber: number
// ) {
//   try {
//     const debtorNames = debtorsBatch.map((debtor) => debtor.name).join("\n");
//     const prompt = `Analyze the following debtor names and list which ones are likely companies. return in array format. dont include helper texts of explaination Here are the debtor names:\n${debtorNames}\n`;

//     // const response = await openai.createCompletion({
//     //   model: "gpt-4o-mini", // Assuming 'gpt-4o-mini' is your model, replace if different
//     //   prompt,
//     //   max_tokens: 1000,
//     // });

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//     });

//     const rawResult = response.choices[0].message.content;

//     // Use updated regex to extract the array part from the response
//     const arrayMatch = rawResult?.match(/\[[\s\S]*?\]/);

//     if (arrayMatch) {
//       const resultArray = arrayMatch[0]; // Extracted array as a string
//       console.log(`Batch ${batchNumber} response: `, resultArray);

//       // Append the result to a file after each batch
//       appendToFile(
//         "/Users/lukaakhalbedashvili/Desktop/ucc-client/analyzed_debtors.json",
//         resultArray + "\n"
//       );
//     } else {
//       console.error(`Batch ${batchNumber}: No array found in the response.`);
//     }
//   } catch (error) {
//     console.error(`Error in batch ${batchNumber} interacting with GPT:`, error);
//   }
// }

// async function processAllBatches() {
//   for (let i = 0; i < numBatches; i++) {
//     const start = i * batchSize;
//     const end = start + batchSize;
//     const debtorsBatch = debtorData.slice(start, end);
//     console.log(`Processing batch ${i + 1} of ${numBatches}...`);
//     await analyzeDebtorsBatch(debtorsBatch, i + 1);
//   }
// }

// export { processAllBatches };
