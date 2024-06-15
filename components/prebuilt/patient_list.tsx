import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { db } from "@/lib/kysley";
import { ChevronRightIcon } from "lucide-react";

export default async function PatientList() {
  const patients = await db.selectFrom("patients").selectAll().execute();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Patients</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {patients.map(patient => (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="border w-10 h-10">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-medium">John Doe</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Age 35 | Recovering from flu</div>
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
