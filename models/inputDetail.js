import prisma from "../DB/db.config.js"

export const getInputDetails = async (input_details_payload) => {
    switch (true){
        case input_details_payload.age <= 30:
            input_details_payload.age = 25
            break;
        case input_details_payload.age <= 40:
            input_details_payload.age = 35
            break;
        case input_details_payload.age <= 50:
            input_details_payload.age = 45
            break;
        case input_details_payload.age <= 60:
            input_details_payload.age = 55
            break;
        case input_details_payload.age <= 70:
            input_details_payload.age = 65
            break;
        case input_details_payload.age > 70:
            input_details_payload.age = 75
            break;
    }
    const inputDetail =  await prisma.inputDetails.findFirst({ 
        where : {
            disease: input_details_payload.disease,
            sub_disease: input_details_payload.sub_disease,
            bio_markers: input_details_payload.bio_markers,
            age: input_details_payload.age,
            gender: input_details_payload.gender,
            race: input_details_payload.race,
        }
    }); 
    return inputDetail;
}

export const getInputDetailsPayload = (payload) => ({
    "age": parseInt(payload.age),
    "gender": payload.gender,
    "race": payload.race,
    "como": payload.como,
    "disease": payload.disease,
    "sub_disease": payload.sub_disease,
    "bio_markers": payload.bio_markers,
    "perf_stat": payload.perf_stat,
    "preferred_drug": "test_drug",
    "alternate_drug": "alternate_drug",
    "guideline_link": "guideline_link",
    "payer_pathway": "payer_pathway",
    "overall_survival": "overall_survival",
    "ae": "ae",
    "ae_management": "ae_management"
})

export const getOutput = (payload) => ({
    preferred_drug: payload.preferred_drug,
    alternate_drug: payload.alternate_drug,
    guideline_link: payload.guideline_link,
    payer_pathway: payload.payer_pathway,
    overall_survival: payload.overall_survival,
    ae: payload.ae,
    ae_management: payload.ae_management
})