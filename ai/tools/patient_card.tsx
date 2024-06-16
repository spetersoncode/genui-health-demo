import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { createRunnableUI } from "@/utils/server";
import { db } from "@/lib/kysley";
import PatientCard, { PatientCardProps } from "@/components/prebuilt/patient_card";

export const patientCardSchema = z.object({
  patientId: z.string().optional().describe("ID of the patient to display"),
  firstName: z.string().optional().describe("First name"),
  lastName: z.string().optional().describe("Last Name"),
});

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
}

async function getPatient(patientId: string, firstName: string, lastName: string): Promise<Patient> {
  let query = db.selectFrom("patients").select(["Id", "FIRST", "LAST", "BIRTHDATE"]);
  if (patientId) {
    query = query.where("Id", "=", patientId);
  } else {
    if (firstName) {
      query = query.where(eb => eb.or([eb("FIRST", "=", firstName), eb("LAST", "=", firstName)]));
    }
    if (lastName) {
      query = query.where(eb => eb.or([eb("FIRST", "=", lastName), eb("LAST", "=", lastName)]));
    }
  }
  const result = await query.limit(1).execute();
  return {
    id: result[0].Id || "",
    firstName: result[0].FIRST || "",
    lastName: result[0].LAST || "",
    age: new Date().getFullYear() - new Date(result[0].BIRTHDATE || "1900-01-01").getFullYear(),
  };
}

export async function patientCardData(input: z.infer<typeof patientCardSchema>) {
  const queryId = input.patientId || "";
  const queryFirstName = input.firstName || "";
  const queryLastName = input.lastName || "";
  const patient = await getPatient(queryId, queryFirstName, queryLastName);

  let query = await db.selectFrom("observations")
    .select(["VALUE", "UNITS"])
    .where("PATIENT", "=", patient.id)
    .where("CODE", "=", "8480-6")
    .orderBy("DATE", "desc")
    .limit(1)
    .execute();
  const bpSystolic = query[0]?.VALUE || "N/A";
  const bpSystolicUnits = query[0]?.UNITS || "";
  
  query = await db.selectFrom("observations")
    .select(["VALUE", "UNITS"])
    .where("PATIENT", "=", patient.id)
    .where("CODE", "=", "8462-4")
    .orderBy("DATE", "desc")
    .limit(1)
    .execute();
  const bpDiastolic = query[0]?.VALUE || "N/A";
  const bpDiastolicUnits = query[0]?.UNITS || "";

  query = await db.selectFrom("observations")
    .select(["VALUE", "UNITS"])
    .where("PATIENT", "=", patient.id)
    .where("CODE", "=", "8867-4")
    .orderBy("DATE", "desc")
    .limit(1)
    .execute();
  const heartRate = query[0]?.VALUE || "N/A";
  const heartRateUnits = query[0]?.UNITS || "";

  query = await db.selectFrom("observations")
    .select(["VALUE", "UNITS"])
    .where("PATIENT", "=", patient.id)
    .where("CODE", "=", "8310-5")
    .orderBy("DATE", "desc")
    .limit(1)
    .execute();
  const temperature = query[0]?.VALUE || "N/A";
  const temperatureUnits = query[0]?.UNITS || "";

  query = await db.selectFrom("observations")
    .select(["VALUE", "UNITS"])
    .where("PATIENT", "=", patient.id)
    .where("CODE", "in", ["2703-7", "2708-6"])
    .orderBy("DATE", "desc")
    .limit(1)
    .execute();
  const oxygenSaturation = query[0]?.VALUE || "N/A";
  const oxygenSaturationUnits = query[0]?.UNITS || "";

  return {
    ...patient,
    bloodPressure: `${bpSystolic}/${bpDiastolic}`,
    bloodPressureUnits: `${bpSystolicUnits}` || `${bpDiastolicUnits}`,
    heartRate: heartRate,
    heartRateUnits: heartRateUnits,
    temperature: temperature,
    temperatureUnits: temperatureUnits,
    oxygenSaturation: oxygenSaturation,
    oxygenSaturationUnits: oxygenSaturationUnits,
    description: `Patient is age ${patient.age}`
  };
}

export const patientCardTool = new DynamicStructuredTool({
  name: "patient_card",
  description:
    "Display an information card about a specific patient.",
  schema: patientCardSchema,
  func: async (input, config) => {
    const stream = await createRunnableUI(config, <p>Loading...</p>);
    const result = await patientCardData(input);
    if (typeof result === "string") {
      // Failed to parse, return error message
      stream.done(<p>{result}</p>);
      return result;
    }
    stream.done(<PatientCard {...result} />);
    return JSON.stringify(result, null);
  },
});