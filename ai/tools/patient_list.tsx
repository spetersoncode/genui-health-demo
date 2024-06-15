import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { createRunnableUI } from "@/utils/server";
import PatientList from "@/components/prebuilt/patient_list";
import { sql } from 'kysely'
import { db } from "@/lib/kysley";


export const patientListSchema = z.object({
  count: z.number().default(20).describe("Number of patients to display"),
});

export const listOfMockedSummaries = [
  "Recovering from flu",
  "Recovering from cold",
  "Recovering from broken leg",
  "Recovering from broken arm",
  "Recovering from broken heart",
  "Recovering from broken spirit",
  "Recovering from broken dreams",
  "Recovering from broken promises",
  "Recovering from broken bones",
]

export async function patientListData(input: z.infer<typeof patientListSchema>) {
  const orderByClause = sql<string>`random()`
  const patientQuery = await db.selectFrom("patients")
    .select([
      "Id",
      "FIRST",
      "LAST",
      "BIRTHDATE",
    ])
    .limit(input.count)
    .orderBy(orderByClause)
    .execute()

    let patients = [];
    for (const patient of patientQuery) {
      patients.push({
        id: patient.Id || "",
        name: `${patient.FIRST} ${patient.LAST}`,
        age: new Date().getFullYear() - new Date(patient.BIRTHDATE || "1900-01-01").getFullYear(),
        summary: listOfMockedSummaries[Math.floor(Math.random() * listOfMockedSummaries.length)]
      });


    }


  // const patients = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //   },
  //     age: 35,
  //     summary: "Recovering from flu",
  //   {
  //     id: 2,
  //     name: "Jane Doe",
  //     age: 25,
  //     summary: "Recovering from cold",
  //   },
  //   {
  //     id: 3,
  //     name: 'Calvin Hobbes',
  //     age: 10,
  //     summary: 'Recovering from broken leg'
  //   }
  // ];
  return {
    ...input,
    patients: patients,
  }
}


export const patientListTool = new DynamicStructuredTool({
  name: "patient_list",
  description:
    "A tool to display the list of patients under our care.",
  schema: patientListSchema,
  func: async (input, config) => {
    const stream = await createRunnableUI(config, <p>Loading...</p>);
    const result = await patientListData(input);
    if (typeof result === "string") {
      // Failed to parse, return error message
      stream.done(<p>{result}</p>);
      return result;
    }
    stream.done(<PatientList {...result} />);
    return JSON.stringify(result, null);
  },
});
