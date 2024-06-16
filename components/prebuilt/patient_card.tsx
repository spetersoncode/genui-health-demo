"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export interface PatientCardProps {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  description: string;
  // encounters: {
  //   id: string;
  //   type: string;
  //   date: string;
  //   doctor: string;
  // }[];
  bloodPressure: string;
  bloodPressureUnits: string;
  heartRate: string;
  heartRateUnits: string;
  temperature: string;
  temperatureUnits: string;
  oxygenSaturation: string;
  oxygenSaturationUnits: string;
  // conditions: {
  //   id: string;
  //   name: string;
  //   status: string;
  // }[];
}

export default function PatientCard(props: PatientCardProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="grid gap-1">
            <CardTitle>{props.firstName} {props.lastName}</CardTitle>
            <CardDescription>{props.age} years old</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <div className="font-semibold">About the Patient</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{props.description}</p>
        </div>
        {/* <div className="grid gap-2">
          <div className="font-semibold">Recent Encounters</div>
          <ul className="grid gap-2 text-sm">
            {props.encounters.map(encounter => (
              <li className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{encounter.type}</div>
                  <div className="text-gray-500 dark:text-gray-400">{encounter.date}</div>
                </div>
                <div>{encounter.doctor}</div>
              </li>
            ))}
          </ul>
        </div> */}
        <div className="grid gap-2">
          <div className="font-semibold">Latest Vital Signs</div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>Blood Pressure</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{props.bloodPressure} {props.bloodPressureUnits}</div>
            </div>
            <div className="flex items-center justify-between">
              <div>Heart Rate</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{props.heartRate} {props.heartRateUnits}</div>
            </div>
            <div className="flex items-center justify-between">
              <div>Temperature</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{props.temperature} {props.temperatureUnits}</div>
            </div>
            <div className="flex items-center justify-between">
              <div>Oxygen Saturation</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{props.oxygenSaturation} {props.oxygenSaturationUnits}</div>
            </div>
          </div>
        </div>
        {/* <div className="grid gap-2">
          <div className="font-semibold">Current Medical Conditions</div>
          <ul className="grid gap-2 text-sm">
            {props.conditions.map(condition => (
              <li className="flex items-center justify-between">
                <div className="font-medium">{condition.name}</div>
                <div>{condition.status}</div>
              </li>
            ))}
          </ul>
        </div> */}
      </CardContent>
    </Card>
  );
}
