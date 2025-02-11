export const createPatientPayload = (payload) => {
    return {
        first_name: payload.first_name, 
        last_name: payload.last_name,
        age: payload.age, 
        race: payload.race, 
        email: payload.email, 
        phone: `${payload.phone}`, 
        gender: payload.gender, 
    }
}

export const createInputOutputDetailsPayload = (payload) => {
    return {
        disease: payload.disease, 
        sub_disease: payload.sub_disease,
        bio_markers: payload.bio_markers, 
        como: payload.como, 
        pathd: payload.pathd, 
        perf_stat: payload.perf_stat,
        preferred_drug: 'crizotinib',
        alternate_drug: 'lazertinib',
        guideline_link: 'http://guideline.com',
        payer_pathway: 'test-payey',
        overall_survival: 'test-survival',
        ae: 'test-ae',
        ae_management: 'test-ae-management'
    }
}

export const createInputOutputDetailMappingPayload = (patient, inputDetail) => {
  return {
        patient: {
            connect: {
                id: patient.id,
            }
        },
        input_output_detail: {
            connect: {
                id: inputDetail.id,
            }
        }
    }
} 

export const validateInputAndGetQuery = (search) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^(?:\(\d{3}\)\s?|\d{3}[-\s]?)?\d{3}[-\s]?\d{4}$/;
    let isValid = false;
    let query = {}
  
    if (emailRegex.test(search)) {
        isValid = true;
        query = { email: search }
    } else if (phoneRegex.test(search)) {
        isValid = true;
        query = { phone: search }
    }

    return { isValid, query };
  }
  