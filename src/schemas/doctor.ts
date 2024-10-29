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

export const States = z.enum([
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
]);

export const ScheduleSchema = z.object({
  dayOfWeek: WeekDay,
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Horário de início inválido. Formato HH:mm"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Horário de término inválido. Formato HH:mm"),
});

export const DoctorSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  specialty: z.string().min(1, "Especialidade é obrigatória"),
  state: States,
  crm: z.string().min(1, "CRM é obrigatório"),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  image: z.string().url("URL da imagem inválida").optional(),
  visibility: z.boolean().default(true),
  createdAt: z.date().optional(),
  schedules: z.array(ScheduleSchema).min(1, "Adicione pelo menos um horário de atendimento"),
});

export const CreateDoctorSchema = DoctorSchema.omit({ id: true, createdAt: true });