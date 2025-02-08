-- CreateEnum
CREATE TYPE "PathD" AS ENUM ('T', 'N', 'M');

-- CreateEnum
CREATE TYPE "COMO" AS ENUM ('DIABETES', 'HYPERTENTION', 'CARDIAC_DISORDER', 'NONE');

-- CreateEnum
CREATE TYPE "PerfStat" AS ENUM ('FULLY_ACTIVE', 'MODERATE_ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'TS');

-- CreateEnum
CREATE TYPE "Race" AS ENUM ('WHITE', 'ASIAN', 'HISPANIC', 'AMERICAN_INDIAN_OR_ALASKA_NATIVE', 'BLACK_OR_AFRICAN_AMERICAN', 'HISPANIC_OR_LATINO', 'NATIVE_HAWAIIAN_OR_OTHER_PACIFIC_ISLANDER');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(191) NOT NULL,
    "email" VARCHAR(191) NOT NULL,
    "password" TEXT NOT NULL,
    "profile" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patients" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "first_name" VARCHAR(191) NOT NULL,
    "last_name" VARCHAR(191) NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" VARCHAR(191) NOT NULL,
    "race" VARCHAR(191) NOT NULL,
    "email" VARCHAR(191) NOT NULL,
    "phone" VARCHAR(191) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InputOutputDetails" (
    "id" SERIAL NOT NULL,
    "pathd" "PathD" NOT NULL DEFAULT 'T',
    "como" "COMO" NOT NULL DEFAULT 'NONE',
    "disease" VARCHAR(191) NOT NULL,
    "sub_disease" VARCHAR(191) NOT NULL,
    "bio_markers" VARCHAR(191) NOT NULL,
    "perf_stat" "PerfStat" NOT NULL DEFAULT 'FULLY_ACTIVE',
    "preferred_drug" VARCHAR(191) NOT NULL,
    "alternate_drug" VARCHAR(191) NOT NULL,
    "guideline_link" VARCHAR(191) NOT NULL,
    "payer_pathway" VARCHAR(191) NOT NULL,
    "overall_survival" VARCHAR(191) NOT NULL,
    "ae" VARCHAR(191) NOT NULL,
    "ae_management" VARCHAR(191) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InputOutputDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InputOutputPatientMappings" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "input_output_detail_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InputOutputPatientMappings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Patients_email_key" ON "Patients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Patients_phone_key" ON "Patients"("phone");

-- AddForeignKey
ALTER TABLE "Patients" ADD CONSTRAINT "Patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InputOutputPatientMappings" ADD CONSTRAINT "InputOutputPatientMappings_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InputOutputPatientMappings" ADD CONSTRAINT "InputOutputPatientMappings_input_output_detail_id_fkey" FOREIGN KEY ("input_output_detail_id") REFERENCES "InputOutputDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
