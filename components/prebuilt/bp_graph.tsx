"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ResponsiveLine } from "@nivo/line"

interface BpGraphProps {
  name: string;
  data: {
    id: string;
    data: { x: string; y: number }[];
  }[];
}

export default function BpGraph(props:BpGraphProps) {
  return (
    <Card className="h-full w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Blood Pressure Trends for {props.name}</CardTitle>
        <CardDescription>Systolic and diastolic blood pressure measurements over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart {...props} />
        <div className="flex justify-center mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full" />
            <span className="text-sm text-blue-600">Systolic</span>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <div className="w-4 h-4 bg-rose-600 rounded-full" />
            <span className="text-sm text-rose-600">Diastolic</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function LineChart(props:BpGraphProps) {
  return (
    <div className="aspect-[16/9]">
      <ResponsiveLine
        data={props.data}
        margin={{ top: 10, right: 10, bottom: 80, left: 40 }}
        xScale={{
          type: "point",
        }}
        yScale={{
          type: "linear",
          min: 40,
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
          tickRotation: -90,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16,
        }}
        colors={["#2563eb", "#e11d48"]}
        pointSize={6}
        useMesh={true}
        gridYValues={6}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
      />
    </div>
  )
}