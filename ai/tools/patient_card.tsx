import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { createRunnableUI } from "@/utils/server";
import { db } from "@/lib/kysley";
import PatientCard, { PatientCardProps } from "@/components/prebuilt/patient_card";

export const patientCardSchema = z.object({
  firstName: z.string().describe("First name"),
  lastName: z.string().describe("Last Name"),
});

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
}

interface Encounter {
  id: string;
  type: string;
  date: string;
}

async function getPatient(firstName: string, lastName: string): Promise<Patient> {
  let query = db.selectFrom("patients").select(["Id", "FIRST", "LAST", "BIRTHDATE"])
    .where(eb => eb.or([eb("FIRST", "like", `%${firstName}%`), eb("LAST", "like", `%${firstName}%`)]))
    .where(eb => eb.or([eb("FIRST", "like", `%${lastName}%`), eb("LAST", "like", `%${lastName}%`)]))
  const result = await query.limit(1).execute();
  return {
    id: result[0].Id || "",
    firstName: result[0].FIRST || "",
    lastName: result[0].LAST || "",
    age: new Date().getFullYear() - new Date(result[0].BIRTHDATE || "1900-01-01").getFullYear(),
  };
}

async function getRecentEncounter(patientId: string, limit: number = 5) {
  const query = await db.selectFrom("encounters")
    .select(["Id", "DESCRIPTION", "START"])
    .where("PATIENT", "=", patientId)
    .orderBy("START", "desc")
    .limit(limit)
    .execute();

  return {
    encounters: query.map((encounter) => ({
      id: encounter.Id || "",
      type: encounter.DESCRIPTION || "",
      date: encounter.START || "",
    })),
  };
}

async function getRecentActiveConditions(patientId: string, limit: number = 5) {
  const query = await db.selectFrom("conditions")
    .select(["DESCRIPTION"])
    .where("PATIENT", "=", patientId)
    .where("STOP", "is", null)
    .where("DESCRIPTION", "not like", "%(finding)%")
    .orderBy("START", "desc")
    .limit(limit)
    .execute();

  return {
    conditions: query.map((condition) => ({
      name: condition.DESCRIPTION || "",
    })),
  };
}

export async function patientCardData(input: z.infer<typeof patientCardSchema>) {
  const queryFirstName = input.firstName || "";
  const queryLastName = input.lastName || "";
  const patient = await getPatient(queryFirstName, queryLastName);

  // I did not transform the data for this demo, it's raw Synthea
  // In a normal EHR these would all be part of a single vital signs reading
  let query = await db.selectFrom("observations")
    .select(["VALUE", "UNITS"])
    .where("PATIENT", "=", patient.id)
    .where("CODE", "=", "8480-6")
    .orderBy("DATE", "desc")
    .limit(1)
    .execute();
  const bpSystolic = query[0]?.VALUE ? parseInt(query[0].VALUE) : "N/A";
  const bpSystolicUnits = query[0]?.UNITS || "";
  
  query = await db.selectFrom("observations")
    .select(["VALUE", "UNITS"])
    .where("PATIENT", "=", patient.id)
    .where("CODE", "=", "8462-4")
    .orderBy("DATE", "desc")
    .limit(1)
    .execute();
  const bpDiastolic = query[0]?.VALUE ? parseInt(query[0].VALUE) : "";
  const bpDiastolicUnits = query[0]?.UNITS || "";

  query = await db.selectFrom("observations")
    .select(["VALUE", "UNITS"])
    .where("PATIENT", "=", patient.id)
    .where("CODE", "=", "8867-4")
    .orderBy("DATE", "desc")
    .limit(1)
    .execute();
  const heartRate = query[0]?.VALUE ? parseInt(query[0].VALUE) : "N/A";
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
    .where("CODE", "=", "2708-6")
    .orderBy("DATE", "desc")
    .limit(1)
    .execute();
  const oxygenSaturation = query[0]?.VALUE || "N/A";
  const oxygenSaturationUnits = query[0]?.UNITS || "";
  const encounters = await getRecentEncounter(patient.id);
  const conditions = await getRecentActiveConditions(patient.id);

  return {
    ...patient,
    ...conditions,
    ...encounters,
    bloodPressure: `${bpSystolic}/${bpDiastolic}`,
    bloodPressureUnits: `${bpSystolicUnits}` || `${bpDiastolicUnits}`,
    heartRate: heartRate,
    heartRateUnits: heartRateUnits,
    temperature: temperature,
    temperatureUnits: temperatureUnits,
    oxygenSaturation: oxygenSaturation,
    oxygenSaturationUnits: oxygenSaturationUnits,
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