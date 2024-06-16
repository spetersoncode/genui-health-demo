import { db } from "./kysley";


export async function getPatient(firstName: string, lastName: string) {
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

export async function getRecentEncounter(patientId: string, limit: number = 5) {
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

export async function getRecentActiveConditions(patientId: string, limit: number = 5) {
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
