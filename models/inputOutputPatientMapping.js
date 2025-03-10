import prisma from "../DB/db.config.js";

export const getLogs = async (patients, { page, pageSize }) => {
    const skip = (page - 1) * pageSize;
    const patientIds = patients.map((pat) => pat.id);
    const logs = await prisma.inputOutputPatientMappings.findMany({
        where: {
            patient_id: { in: patientIds }
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
        skip: skip,
        take: pageSize,
        orderBy: {
            id: 'asc',
        },
    });

    const totalPatients = await prisma.inputOutputPatientMappings.count({
        where: {
            patient_id: { in: patientIds }
        },
    });

    return {
        logs,
        page,
        totalPatients,
        totalPages: Math.ceil(totalPatients / pageSize),
    }
}