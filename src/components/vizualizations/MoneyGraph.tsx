"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { MemberFeeOptions } from "@/hooks";
import { TrendingUp } from "lucide-react";

interface ChartDataItem {
  month: string;
  [key: string]: number | string;
}

const chartConfig = {
  colletion: {
    label: "collection",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function MoneyGraph({
  memberFeesLoading,
  memberFees,
}: {
  memberFeesLoading: boolean;
  memberFees: MemberFeeOptions[];
}) {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [programs, setPrograms] = useState<string[]>([]);

  useEffect(() => {
    if (!memberFeesLoading) {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];
      const currentYear = new Date().getFullYear();
      const paymentsByMonthAndProgram: {
        [month: string]: { [program: string]: number };
      } = {};
      const uniquePrograms: Set<string> = new Set();

      months.forEach((month) => {
        paymentsByMonthAndProgram[month] = {};
      });

      memberFees.forEach((fee) => {
        const date = new Date(fee.paidDate);
        if (date.getFullYear() === currentYear) {
          const monthName = months[date.getMonth()];
          const programName = fee.Member.MemberPrograms[0]?.Program?.name;
          //@ts-ignore
          uniquePrograms.add(programName);
          //@ts-ignore
          if (!paymentsByMonthAndProgram[monthName][programName]) {
            //@ts-ignore
            paymentsByMonthAndProgram[monthName][programName] = 0;
          }
          //@ts-ignore
          paymentsByMonthAndProgram[monthName][programName] += Number(
            fee.Payments[0].amount
          );
        }
      });

      const formattedData = months.map((month) => {
        const monthData: ChartDataItem = { month };
        Object.keys(paymentsByMonthAndProgram[month]).forEach((program) => {
          monthData[program] = paymentsByMonthAndProgram[month][program];
        });
        return monthData;
      });

      setChartData(formattedData);
      setPrograms(Array.from(uniquePrograms));
    }
  }, [memberFeesLoading, memberFees]);

  return (
    <>
      <Card>
        <CardHeader className="mb-24">
          <CardTitle>Monthly Collection</CardTitle>
          <CardDescription>
            For the year - {new Date().getFullYear()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={10} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />

              <ChartLegend content={<ChartLegendContent />} />
              {programs.map((program, index) => (
                <Bar
                  key={program}
                  dataKey={program}
                  stackId="a"
                  fill={`hsl(var(--chart-${index + 1}))`}
                  accumulate="sum"
                />
              ))}
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none text-muted-foreground opacity-80">
            Showing total collections for the current year
            <TrendingUp className="h-4 w-4 text-secondary-foreground" />
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
