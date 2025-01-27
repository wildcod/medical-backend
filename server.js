import express from "express"
import "dotenv/config"
import cors from "cors"
const app = express()
const port = process.env.PORT || 3001
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import prisma from "./DB/db.config.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors())

app.get("/", (req, res) =>{
    res.json({message: "Hello world!"})
})

import ApiRoutes from "./routes/api.js";
app.use("/api", ApiRoutes);


// const csvFilePath = path.join(__dirname, 'medical_demo.csv');

// // async function importCsvToDb(filePath) {
// //     const results = [];

// //     // Parse the CSV file
// //     fs.createReadStream(filePath)
// //         .pipe(csv())
// //         .on('data', (data) => results.push(data))
// //         .on('end', async () => {
// //             for (const row of results) {
// //                 const {
// //                     age,
// //                     gender,
// //                     race,
// //                     como,
// //                     disease,
// //                     sub_disease,
// //                     bio_markers,
// //                     perf_stat,
// //                     preferred_drug,
// //                     alternate_drug,
// //                     guideline_link,
// //                     payer_pathway,
// //                     overall_survival,
// //                     ae,
// //                     ae_management,
// //                 } = row;
// //                 console.log("Row: " + JSON.stringify(row));
// //                 try {
// //                     const record = await prisma.inputDetails.findFirst({
// //                         where: {
// //                             "age": parseInt(age),
// //                             "gender": gender,
// //                             "race": race,
// //                             "como": como,
// //                             "disease": disease,
// //                             "sub_disease": sub_disease,
// //                             "bio_markers": bio_markers,
// //                             "perf_stat": perf_stat,
// //                         },
// //                     })
// //                     console.log("record: ", record);
// //                     if(!record){
// //                         await prisma.inputDetails.create({ 
// //                             data: {
// //                                 "age": parseInt(age),
// //                                 "gender": gender,
// //                                 "race": race,
// //                                 "como": como,
// //                                 "disease": disease,
// //                                 "sub_disease": sub_disease,
// //                                 "bio_markers": bio_markers,
// //                                 "perf_stat": perf_stat,
// //                                "preferred_drug": preferred_drug,
// //                                 "alternate_drug": alternate_drug,
// //                                 "guideline_link": guideline_link,
// //                                 "payer_pathway": payer_pathway,
// //                                 "overall_survival": overall_survival,
// //                                 "ae": ae,
// //                                 "ae_management": ae_management
// //                             }
// //                         })
// //                     }
// //                 } catch (err) {
// //                     console.error('Error inserting/updating data:', err);
// //                 }
// //             }
// //         });
// // }

// // await importCsvToDb(csvFilePath);
// // const records = await prisma.inputDetails.findMany({});
// // console.log("records: ", records)


app.listen(port, () => console.log("Server listening on: " + port));