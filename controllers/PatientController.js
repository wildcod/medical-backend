import vine, {errors} from "@vinejs/vine";
import { patientSchema, existingPatientSchema } from "../validations/PatientValidation.js";
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
            const { page = 1, pageSize = 10, ...restFilters } = req.query;

            const { isValid, query } = validateInputAndGetQuery(restFilters)

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

    static async newPatient(req, res){
        try{
            const user = req.user;
            const body = req.body;
            const validator = vine.compile(patientSchema);
            const payload = await validator.validate(body);
            
            
            // check paitent exists or not
            let patient = await prisma.patients.findUnique({
                where: { 
                    phone: payload.phone
                }
            });

            if(patient){
                return res.status(409).json({message: "Duplicate patient entry not allowed"});
            }

       
            const patient_payload = { user_id: user.id, ...createPatientPayload(payload)};
            patient = await prisma.patients.create({data:patient_payload});
            

            const input_details_payload = createInputOutputDetailsPayload(payload);
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

    static async existingPatient(req, res){
        try{
            const user = req.user;
            const body = req.body;
            const validator = vine.compile(existingPatientSchema);
            const payload = await validator.validate(body);
            
            
            // check paitent exists or not
            const patient = await prisma.patients.findUnique({
                where: { 
                    phone: payload.phone
                }
            });

            if(!patient){
                return res.status(409).json({message: "Patient not found"});
            }
            

            const input_details_payload = createInputOutputDetailsPayload(payload);
            const inputOutputDetails = await prisma.inputOutputDetails.create({ data: input_details_payload })
            console.log("input details from db: ", inputOutputDetails);

            const inputOutputPatientMappings_payload = createInputOutputDetailMappingPayload(patient, inputOutputDetails);
            console.log("inputOutputPatientMappings_payload: ", inputOutputPatientMappings_payload);
            await prisma.inputOutputPatientMappings.create({data:inputOutputPatientMappings_payload});
            const output = getOutput(inputOutputDetails);
            return res.status(200).json({message: "ouput generated", output});
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

    static async recentPatients(req, res){
        try{
            const inputOuputMapping = await prisma.inputOutputPatientMappings.findMany({
                orderBy: {
                    created_at: 'desc',
                  },
                  select: {patient: {select: {
                    dob: true,
                    email: true,
                    gender: true,
                    phone: true,
                    race: true,
                    first_name: true,
                    last_name: true,
                }}, input_output_detail: {
                    select: {
                    ae: true,
                    insurance: true,
                    smoker: true,
                    ae_management: true,
                    alternate_drug: true,
                    guideline_link: true,
                    preferred_drug: true,
                    payer_pathway: true,
                    overall_survival: true,
                    disease: true,
                    sub_disease: true,
                    bio_markers: true,
                    como: true,
                    perf_stat: true,
                    pathd: true
                }}},  
                take: 5,
            });

            if(!inputOuputMapping || !inputOuputMapping.length){
                return res.status(200).json({data: []});
            }

            return res.status(200).json({data: inputOuputMapping});
        }
        catch(error){
            console.log(error);
            res.status(500).json({message: "Something went wrong, Please try again later."});
        }
    }

    static async update(){
        
    }

    static async destroy(){
        
    }
}
