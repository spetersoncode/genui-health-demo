import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { createRunnableUI } from "@/utils/server";
import { db } from "@/lib/kysley";
import PatientCard from "@/components/prebuilt/patient_card";
import { getPatient, getRecentActiveConditions, getRecentEncounter } from "@/lib/get_data";

export const patientCardSchema = z.object({
  firstName: z.string().describe("First name"),
  lastName: z.string().describe("Last Name"),
});

export async function patientCardData(input: z.infer<typeof patientCardSchema>) {
  const queryFirstName = input.firstName || "";
  const queryLastName = input.lastName || "";
  const patient = await getPatient(queryFirstName, queryLastName);

  // I did not transform the data for this demo, it's raw Synthea
  // In a normal EHR these would all be part of a single vital signs reading
  let query = await db
    .selectFrom("observations")
    .select(["VALUE", "UNITS"])
    .where("PATIENT", "=", patient.id)
    .where("CODE", "=", "8480-6")
    .orderBy("DATE", "desc")
    .limit(1)
    .execute();
  const bpSystolic = query[0]?.VALUE ? parseInt(query[0].VALUE) : "N/A";
  const bpSystolicUnits = query[0]?.UNITS || "";

  query = await db
    .selectFrom("observations")
    .select(["VALUE", "UNITS"])
    .where("PATIENT", "=", patient.id)
    .where("CODE", "=", "8462-4")
    .orderBy("DATE", "desc")
    .limit(1)
    .execute();
  const bpDiastolic = query[0]?.VALUE ? parseInt(query[0].VALUE) : "";
  const bpDiastolicUnits = query[0]?.UNITS || "";

  query = await db
    .selectFrom("observations")
    .select(["VALUE", "UNITS"])
    .where("PATIENT", "=", patient.id)
    .where("CODE", "=", "8867-4")
    .orderBy("DATE", "desc")
    .limit(1)
    .execute();
  const heartRate = query[0]?.VALUE ? parseInt(query[0].VALUE) : "N/A";
  const heartRateUnits = query[0]?.UNITS || "";

  query = await db
    .selectFrom("observations")
    .select(["VALUE", "UNITS"])
    .where("PATIENT", "=", patient.id)
    .where("CODE", "=", "8310-5")
    .orderBy("DATE", "desc")
    .limit(1)
    .execute();
  const temperature = query[0]?.VALUE || "N/A";
  const temperatureUnits = query[0]?.UNITS || "";

  query = await db
    .selectFrom("observations")
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
  description: "Display an information card/chart about a patient.",
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
