import vine from "@vinejs/vine";
import { CustomErrorReporter } from "./CustomErrorReporter.js";

vine.errorReporter = () => new CustomErrorReporter()

export const patientSchema = vine.object({
    first_name: vine.string().minLength(2).maxLength(150),
    last_name: vine.string().minLength(2).maxLength(150),
    dob: vine.string().minLength(2).maxLength(150),
    insurance: vine.string().minLength(2).maxLength(150),
    smoker: vine.enum(['YES', 'NO']),
    gender: vine.enum(['MALE', 'FEMALE', 'BINARY', 'TS']),
    email: vine.string().email(),
    phone: vine.string().minLength(10).maxLength(15),
    race: vine.string().minLength(2).maxLength(150),
    pathd: vine.enum(['T', 'N', 'M']),
    como: vine.enum(['DIABETES', 'HYPERTENTION', 'NONE']),
    disease: vine.string().minLength(2).maxLength(150),
    sub_disease: vine.string().minLength(2).maxLength(150),
    bio_markers: vine.string().minLength(2).maxLength(150),
    perf_stat: vine.enum(['FULLY_ACTIVE', 'MODERATE_ACTIVE', 'INACTIVE'])
})

export const existingPatientSchema = vine.object({
    insurance: vine.string().minLength(2).maxLength(150),
    smoker: vine.enum(['YES', 'NO']),
    gender: vine.enum(['MALE', 'FEMALE', 'BINARY', 'TS']),
    patientId: vine.number().withoutDecimals(),
    pathd: vine.enum(['T', 'N', 'M']),
    como: vine.enum(['DIABETES', 'HYPERTENTION', 'NONE']),
    disease: vine.string().minLength(2).maxLength(150),
    sub_disease: vine.string().minLength(2).maxLength(150),
    bio_markers: vine.string().minLength(2).maxLength(150),
    perf_stat: vine.enum(['FULLY_ACTIVE', 'MODERATE_ACTIVE', 'INACTIVE'])
})