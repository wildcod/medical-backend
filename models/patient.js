import prisma from "../DB/db.config.js"

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const checkUserPatient = async (user, payload) => {
    if(payload.email){
        return await prisma.patients.findUnique({
            where: {
                user_id: user.id,
                email: payload.email    
            },
        });
    }
    else{
        console.log("payload", payload)
        return await prisma.patients.findUnique({
            where: {
                user_id: user.id,
                phone: JSON.stringify(payload.email)
            },
        });
    }
}

export const checkPatientByUserId = async (user, query) => {

    return await prisma.patients.findMany({
        where: { 
            user_id:  Number(user.id),
            ...query
        }
    });
}