"use client"

import { ColumnDef } from "@tanstack/react-table"
import { z } from "zod";
import ActionMenu from "./actionMenu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, CheckCircle, XCircle } from "lucide-react";

export type Doctor = {
  id: number,
  name: string,
  specialty: string,
  state: string,
  crm: string,
  phone?: string,
  email?: string,
  visibility: boolean,
  createdAt: Date,
  schedules: {
    dayOfWeek: string,
    startTime: string,
    endTime: string,
  }[],
}

const doctorSchema = z.object({
  id: z.number(),
  name: z.string(),
  specialty: z.string(),
  state: z.string(),
  crm: z.string(),
  phone: z.string().optional(),
  email: z.string().optional(),
  visibility: z.boolean(),
  createdAt: z.date(),
  schedules: z.array(z.object({
    dayOfWeek: z.string(),
    startTime: z.string(),
    endTime: z.string(),
  })),
});

export type Doctors = z.infer<typeof doctorSchema>;

export const columns: ColumnDef<Doctors>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "specialty",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Especialidade
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "state",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Estado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "crm",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          CRM
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Telefone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: info => {
      const value = info.getValue<string>();
      return (
        <span className={value ? "" : "text-gray-500"}>
          {value || "Não informado"}
        </span>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          E-mail
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: info => {
      const value = info.getValue<string>();
      return (
        <span className={value ? "" : "text-gray-500"}>
          {value || "Não informado"}
        </span>
      )
    },
  },
  {
    accessorKey: "visibility",
    header: ({ column }) => {
        return (
            <div className="flex justify-center">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Visiblidade
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </div>
        )
    },
    cell: info => {
        const visibility = info.getValue<boolean>();
        return (
            <div className="text-center">
                {visibility ? (
                    <div className="flex items-center justify-center text-green-500">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                ) : (
                    <div className="flex items-center justify-center text-red-500">
                        <XCircle className="w-5 h-5" />
                    </div>
                )}
            </div>
        );
    },
},
  {
    id: "actions",
    cell: ({ row }) => {
      const doctor = row.original;

      return (
        <ActionMenu doctor={doctor} />
      );
    },
  },
];