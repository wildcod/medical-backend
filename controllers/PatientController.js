import vine, {errors} from "@vinejs/vine";
import { patientSchema } from "../validations/PatientValidation.js";
import { patientSearchSchema } from "../validations/PatientSearchValidation.js";
import prisma from "../DB/db.config.js";
import { createInputOutputDetailsPayload, createInputOutputDetailMappingPayload, createPatientPayload, validateInputAndGetQuery } from "../utils/helper.js";
import { getInputDetails, getInputDetailsPayload, getOutput } from "../models/inputDetail.js";
import { checkPatientByUserId, checkUserPatient } from "../models/patient.js";
import { getLogs } from "../models/inputOutputPatientMapping.js";

export default class PatientController {

    static async show(req, res) {
        try{
            const user = req.user;
            const body = req.query;
            const validator = vine.compile(patientSearchSchema);
            const payload = await validator.validate(body);
            console.log('USER', user);
            const patient = await checkUserPatient(user, payload);
            if(!patient) return res.status(404).json({message: "Patient not found"});
            const logs = await getLogs(patient.id);
            return res.status(200).json({message: "Logs found", logs});
        }
        catch(error){
            console.log(error);
            if(error instanceof errors.E_VALIDATION_ERROR) {
                res.status(400).json({errors: error.messages});
            }
            else{
                res.status(500).json({message: "Something went wrong, Please try again later."});
            }
        }
    }

    static async showAll(req, res) {
        try{
            const user = req.user;
            const { page = 1, pageSize = 10, search } = req.query;

            const { isValid, query } = validateInputAndGetQuery(search)

            if(!isValid){
                return res.status(400).json({error: 'Invalid search query, Please try again.'});
            }


            const patients = await checkPatientByUserId(user, query);
            if(!patients || !patients.length) return res.status(404).json({message: "Patient not found"});
            const response = await getLogs(patients, {page, pageSize});
            return res.status(200).json({message: "Logs found", data: response});
        }
        catch(error){
            console.log(error);
            if(error instanceof errors.E_VALIDATION_ERROR) {
                res.status(400).json({errors: error.messages});
            }
            else{
                res.status(500).json({message: "Something went wrong, Please try again later."});
            }
        }
    }

    static async store(req, res){
        try{
            const user = req.user;
            const body = req.body;
            const validator = vine.compile(patientSchema);
            const payload = await validator.validate(body);
            
            const patient_payload = createPatientPayload(payload);
            const input_details_payload = createInputOutputDetailsPayload(payload);
            patient_payload.user_id = user.id;
            console.log("patient payload : ", patient_payload);
            console.log("input details payload : ", input_details_payload);
            let patient = await prisma.patients.findUnique({
                where: { 
                    email: payload.email
                }
            })
            console.log("patient from db : ", patient);
            if(!patient) {
                patient = await prisma.patients.create({data:patient_payload});
            }
            else {
                //update patient
                patient = await prisma.patients.update({
                    where: { 
                        email: payload.email
                    },
                    data: {age: patient_payload.age}
                })
            }
            // const inputDetail = await getInputDetails(input_details_payload);
            // const inputDetailPayload = getInputDetailsPayload(input_details_payload)
            const inputOutputDetails = await prisma.inputOutputDetails.create({ data: input_details_payload })
            // if(!inputDetail) {
            //     res.status(404).json({message: "Not match with input details."});
            // }
            console.log("input details from db: ", inputOutputDetails);
            // const outputDetail = await getOutputDetails(inputDetail);
            const inputOutputPatientMappings_payload = createInputOutputDetailMappingPayload(patient, inputOutputDetails);
            console.log("inputOutputPatientMappings_payload: ", inputOutputPatientMappings_payload);
            await prisma.inputOutputPatientMappings.create({data:inputOutputPatientMappings_payload});
            const output = getOutput(inputOutputDetails);
            return res.status(200).json({message: "patient created successfully", output});
        }
        catch(error){
            console.log(error);
            if(error instanceof errors.E_VALIDATION_ERROR) {
                res.status(400).json({errors: error.messages});
            }
            else{
                res.status(500).json({message: "Something went wrong, Please try again later."});
            }
        }
    }

    static async update(){
        
    }

    static async destroy(){
        
    }
}
