"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export interface PatientCardProps {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  encounters: {
    id: string;
    type: string;
    date: string;
  }[];
  bloodPressure: number | string;
  bloodPressureUnits: string;
  heartRate: number | string;
  heartRateUnits: string;
  temperature: number | string;
  temperatureUnits: string;
  oxygenSaturation: number | string;
  oxygenSaturationUnits: string;
  conditions: {
    name: string;
  }[];
}

export default function PatientCard(props: PatientCardProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="grid gap-1">
            <CardTitle>
              {props.firstName} {props.lastName}
            </CardTitle>
            <CardDescription>{props.age} years old</CardDescription>
          </div>
          <Avatar className="border w-16 h-16">
            <AvatarImage src={`https://robohash.org/${props.id}`} />
            <AvatarFallback>
              {props.firstName[0]}
              {props.lastName[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <div className="font-semibold">Latest Vital Signs</div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>Blood Pressure</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {props.bloodPressure} {props.bloodPressureUnits}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>Heart Rate</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {props.heartRate} {props.heartRateUnits}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>Temperature</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {props.temperature} {props.temperatureUnits}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>Oxygen Saturation</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {props.oxygenSaturation} {props.oxygenSaturationUnits}
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-2">
          <div className="font-semibold">Current Medical Conditions</div>
          <ul className="grid gap-2 text-sm">
            {props.conditions.map(condition => (
              <li className="flex items-center justify-between">
                <div className="font-medium">{condition.name}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-2">
          <div className="font-semibold">Recent Encounters</div>
          <ul className="grid gap-2 text-sm">
            {props.encounters.map(encounter => (
              <li className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{encounter.type}</div>
                  <div className="text-gray-500 dark:text-gray-400">{encounter.date}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
