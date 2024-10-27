import * as z from 'zod'

const WeekDay = z.enum([
    "Segunda",
    "Terca",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sabado",
    "Domingo",
]);

export const DoctorSchema = z.object({
    id: z.number().int().positive().optional(),
    name: z.string().min(1, "Nome é obrigatório"),
    specialty: z.string().min(1, "Especialidade é obrigatória"),
    phone: z.string().optional().nullable(),
    email: z.string().email("Email inválido").optional().nullable(),
    image: z.string().url("URL da imagem inválida").optional().nullable(),
    createdAt: z.date().optional(),
    schedules: z.array(z.lazy(() => ScheduleSchema)).optional(),
});

export const ScheduleSchema = z.object({
    id: z.number().int().positive().optional(),  // ID é opcional, pois geralmente é gerado automaticamente
    diaSemana: WeekDay,  // Usa o enum DiaSemana
    startTime: z.date(),   // Horário de início
    endTime: z.date(),     // Horário de término
    doctorId: z.number().int().positive(),  // Relacionamento com o Doctor
});

export const CreateDoctorSchema = DoctorSchema.omit({ id: true, createdAt: true }).extend({
    schedules: z
        .array(
            ScheduleSchema.omit({ id: true }).extend({
                diaSemana: WeekDay,
            })
        )
        .optional(),
});