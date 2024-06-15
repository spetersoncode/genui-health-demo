import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { createRunnableUI } from "@/utils/server";
import PatientList from "@/components/prebuilt/patient_list";


const patientListSchema = z.object({
  name: z.string().describe("The name of the patient."),
  age: z.number().describe("The age of the patient."),
  summary: z.string().describe("A one-line summary of the patient."),
});

export async function patientListData(input: z.infer<typeof patientListSchema>) {
  return {
    name: "John Doe",
    age: 35,
    summary: "Recovering from flu",
  };
}


export const patientListTool = new DynamicStructuredTool({
  name: "patient_list",
  description:
    "A tool to fetch list of patients under our care. It will display the patient's name, age, and one-line summary.",
  schema: patientListSchema,
  func: async (input, config) => {
    const stream = await createRunnableUI(config, <p>Loading...</p>);
    const result = await patientListData(input);
    if (typeof result === "string") {
      // Failed to parse, return error message
      stream.done(<p>{result}</p>);
      return result;
    }
    stream.done(<PatientList />);
    return JSON.stringify(result, null);
  },
});
