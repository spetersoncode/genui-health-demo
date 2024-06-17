import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { createRunnableUI } from "@/utils/server";
import { db } from "@/lib/kysley";
import PatientCard, { PatientCardProps } from "@/components/prebuilt/patient_card";
import { getPatient, getRecentActiveConditions, getRecentEncounter } from "@/lib/get_data";
import BpGraph from "@/components/prebuilt/bp_graph";

export const bpGraphSchema = z.object({
  firstName: z.string().describe("First name"),
  lastName: z.string().describe("Last Name"),
});

export async function bpGraphData(input: z.infer<typeof bpGraphSchema>) {
  const queryFirstName = input.firstName || "";
  const queryLastName = input.lastName || "";
  const patient = await getPatient(queryFirstName, queryLastName);

  let query = await db
    .selectFrom("observations")
    .select(["DATE", "VALUE"])
    .where("PATIENT", "=", patient.id)
    .where("CODE", "=", "8480-6")
    .orderBy("DATE", "asc")
    .limit(10)
    .execute();
  const bpSystolicData = query.map((result) => ({
    x: result.DATE ? result.DATE.split("T")[0] : "",
    y: result.VALUE ? parseInt(result.VALUE) : 0,
  }));

  query = await db
    .selectFrom("observations")
    .select(["DATE", "VALUE"])
    .where("PATIENT", "=", patient.id)
    .where("CODE", "=", "8462-4")
    .orderBy("DATE", "asc")
    .limit(10)
    .execute();
  const bpDiastolicData= query.map((result) => ({
    x: result.DATE ? result.DATE.split("T")[0] : "",
    y: result.VALUE ? parseInt(result.VALUE) : 0,
  }));

  return {
    name: `${patient.firstName} ${patient.lastName}`,
    data: [
      { id: "Systolic", data: bpSystolicData },
      { id: "Diastolic", data: bpDiastolicData },
    ],
  };
}
  

export const bpGraphTool = new DynamicStructuredTool({
  name: "bp_graph",
  description: "Display a graph of blood pressure readings for a patient.",
  schema: bpGraphSchema,
  func: async (input, config) => {
    const stream = await createRunnableUI(config, <p>Loading...</p>);
    const result = await bpGraphData(input);
    if (typeof result === "string") {
      // Failed to parse, return error message
      stream.done(<p>{result}</p>);
      return result;
    }
    stream.done(<BpGraph {...result} />);
    return JSON.stringify(result, null);
  },
});
