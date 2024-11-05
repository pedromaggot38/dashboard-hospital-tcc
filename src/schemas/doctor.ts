import * as z from 'zod'

export const WeekDay = z.enum([
  "Segunda",
  "Terca",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sabado",
  "Domingo",
]);

export const DoctorSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  specialty: z.string().min(1, "Especialidade é obrigatória"),
  state: z.enum([
      "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
      "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
      "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ]).optional(),
  crm: z
  .string()
  .min(1, "CRM é obrigatório")
  .regex(/^\d+$/, "CRM deve conter apenas números"),
  visibility: z.boolean(),
  schedules: z.array(z.object({
      dayOfWeek: WeekDay,
      startTime: z.string(),
      endTime: z.string(),
  })),
  phone: z.string().optional().nullable(),
  email: z.string().email("E-mail inválido").optional(),
});