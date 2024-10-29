"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image";
import { z } from "zod";
import ActionMenu from "./actionMenu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type Doctor = {
  id: number,
  name: string,
  specialty: string,
  state: string,
  crm: string,
  phone?: string,
  email?: string,
  image?: string,
  createdAt: Date,
  schedules: {
    dayOfWeek: string,
    startTime: string,
    endTime: string,
  }[],
}

export const doctorSchema = z.object({
  id: z.number(),
  name: z.string(),
  specialty: z.string(),
  state: z.string(),
  crm: z.string(),
  phone: z.string().optional(),
  email: z.string().optional(),
  image: z.string().optional(),
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
    header: "Estado",
  },
  {
    accessorKey: "crm",
    header: "CRM",
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    cell: info => {
      const value = info.getValue<string>();
      return <div>{value || 'Não informado'}</div>;
    },
  },
  {
    accessorKey: "email",
    header: "E-mail",
    cell: info => {
      const value = info.getValue<string>();
      return <div>{value || 'Não informado'}</div>;
    },
  },
  {
    accessorKey: "image",
    header: "Imagem",
    cell: info => {
      const imageUrl = info.getValue<string>();
      return (
        <div>
          {imageUrl ? (
            <Image src={imageUrl} alt="Imagem do médico" className="h-10 w-10 rounded-full" />
          ) : (
            <div className="h-10 w-10 bg-gray-200 rounded-full" />
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