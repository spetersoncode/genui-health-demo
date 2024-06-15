import SQLite from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'

const dialect = new SqliteDialect({
  database: new SQLite(process.env.DATABASE_URL),
})

export const db = new Kysely<DB>({
  dialect,
})

export interface Allergies {
  CATEGORY: string | null;
  CODE: number | null;
  DESCRIPTION: string | null;
  DESCRIPTION1: string | null;
  DESCRIPTION2: string | null;
  ENCOUNTER: string | null;
  PATIENT: string | null;
  REACTION1: number | null;
  REACTION2: number | null;
  SEVERITY1: string | null;
  SEVERITY2: string | null;
  START: string | null;
  STOP: number | null;
  SYSTEM: string | null;
  TYPE: string | null;
}

export interface Conditions {
  CODE: number | null;
  DESCRIPTION: string | null;
  ENCOUNTER: string | null;
  PATIENT: string | null;
  START: string | null;
  STOP: string | null;
}

export interface Encounters {
  BASE_ENCOUNTER_COST: number | null;
  CODE: number | null;
  DESCRIPTION: string | null;
  ENCOUNTERCLASS: string | null;
  Id: string | null;
  ORGANIZATION: string | null;
  PATIENT: string | null;
  PAYER: string | null;
  PAYER_COVERAGE: number | null;
  PROVIDER: string | null;
  REASONCODE: number | null;
  REASONDESCRIPTION: string | null;
  START: string | null;
  STOP: string | null;
  TOTAL_CLAIM_COST: number | null;
}

export interface Immunizations {
  BASE_COST: number | null;
  CODE: number | null;
  DATE: string | null;
  DESCRIPTION: string | null;
  ENCOUNTER: string | null;
  PATIENT: string | null;
}

export interface Medications {
  BASE_COST: number | null;
  CODE: number | null;
  DESCRIPTION: string | null;
  DISPENSES: number | null;
  ENCOUNTER: string | null;
  PATIENT: string | null;
  PAYER: string | null;
  PAYER_COVERAGE: number | null;
  REASONCODE: number | null;
  REASONDESCRIPTION: string | null;
  START: string | null;
  STOP: string | null;
  TOTALCOST: number | null;
}

export interface Observations {
  CATEGORY: string | null;
  CODE: string | null;
  DATE: string | null;
  DESCRIPTION: string | null;
  ENCOUNTER: string | null;
  PATIENT: string | null;
  TYPE: string | null;
  UNITS: string | null;
  VALUE: string | null;
}

export interface Patients {
  ADDRESS: string | null;
  BIRTHDATE: string | null;
  BIRTHPLACE: string | null;
  CITY: string | null;
  COUNTY: string | null;
  DEATHDATE: string | null;
  DRIVERS: string | null;
  ETHNICITY: string | null;
  FIPS: number | null;
  FIRST: string | null;
  GENDER: string | null;
  HEALTHCARE_COVERAGE: number | null;
  HEALTHCARE_EXPENSES: number | null;
  Id: string | null;
  INCOME: number | null;
  LAST: string | null;
  LAT: number | null;
  LON: number | null;
  MAIDEN: string | null;
  MARITAL: string | null;
  PASSPORT: string | null;
  PREFIX: string | null;
  RACE: string | null;
  SSN: string | null;
  STATE: string | null;
  SUFFIX: string | null;
  ZIP: number | null;
}

export interface Procedures {
  BASE_COST: number | null;
  CODE: number | null;
  DESCRIPTION: string | null;
  ENCOUNTER: string | null;
  PATIENT: string | null;
  REASONCODE: number | null;
  REASONDESCRIPTION: string | null;
  START: string | null;
  STOP: string | null;
}

export interface Providers {
  ADDRESS: string | null;
  CITY: string | null;
  ENCOUNTERS: number | null;
  GENDER: string | null;
  Id: string | null;
  LAT: number | null;
  LON: number | null;
  NAME: string | null;
  ORGANIZATION: string | null;
  PROCEDURES: number | null;
  SPECIALITY: string | null;
  STATE: string | null;
  ZIP: number | null;
}

export interface DB {
  allergies: Allergies;
  conditions: Conditions;
  encounters: Encounters;
  immunizations: Immunizations;
  medications: Medications;
  observations: Observations;
  patients: Patients;
  procedures: Procedures;
  providers: Providers;
}
