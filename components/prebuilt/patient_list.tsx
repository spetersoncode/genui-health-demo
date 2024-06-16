"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";

export interface PatientListProps {
  patients: {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    summary: string;
  }[];
}

export default async function PatientList(props: PatientListProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Patients</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {props.patients.map(patient => (
          <div key={patient.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="border w-10 h-10">
                <AvatarImage src={`https://robohash.org/${patient.id}`} />
                <AvatarFallback>
                  {patient.firstName[0]}
                  {patient.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-medium">{patient.firstName} {patient.lastName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Age {patient.age} | {patient.summary}
                </div>
              </div>
            </div>
            <Button variant="outline" size="icon">
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
