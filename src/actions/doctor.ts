'use server'

import * as z from 'zod'
import { db } from "@/lib/db"
import { revalidatePath } from 'next/cache';
import { CreateDoctorSchema } from '@/schemas/doctor';

export const createDoctor = async (values: z.infer<typeof CreateDoctorSchema>) => {
    const validatedFields = CreateDoctorSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Erro ao validar os campos", details: validatedFields.error.errors };
    }

    const { name, state, crm, specialty, email, phone, image, schedules } = validatedFields.data;

    const existingDoctor = await db.doctor.findFirst({
        where: {
            OR: [
                { crm },
                { email },
                { phone },
            ],
        },
    });

    if (existingDoctor) {
        if (existingDoctor.crm === crm) {
            return { error: 'CRM já registrado!' };
        }
        if (existingDoctor.email === email) {
            return { error: 'Email já registrado!' };
        }
        if (existingDoctor.phone === phone) {
            return { error: 'Telefone já registrado!' };
        }
    }

    const dayScheduleMap = new Map(); // Para rastrear horários por dia da semana
    for (const schedule of schedules) {
        if (dayScheduleMap.has(schedule.dayOfWeek)) {
            return { error: `Já existe um horário para ${schedule.dayOfWeek}!` };
        }
        dayScheduleMap.set(schedule.dayOfWeek, schedule);
    }

    try {
        await db.doctor.create({
            data: {
                name,
                state,
                crm,
                specialty,
                email,
                phone,
                image,
                schedules: {
                    create: schedules.map(schedule => ({
                        dayOfWeek: schedule.dayOfWeek,
                        startTime: new Date(`2025-01-01T${schedule.startTime}:00Z`),
                        endTime: new Date(`2025-01-01T${schedule.endTime}:00Z`),
                    })),
                },
            },
        });
    } catch (error) {
        console.error("Erro ao criar o médico:", error);
        return { error: "Erro ao criar o médico. Tente novamente mais tarde." };
    }
    revalidatePath('/dashboard/doctors');
    return { success: "Médico criado com sucesso!" };
};

export const deleteDoctor = async (doctorCrm: string) => {
    try {
        const existingDoctor = await db.doctor.findUnique({
            where: { crm: doctorCrm },
        });

        if (!existingDoctor) {
            return { error: "Médico não encontrado!" };
        }

        await db.doctor.delete({
            where: { crm: doctorCrm },
        });

        revalidatePath('/dashboard/doctors');
        return { success: "Médico excluído com sucesso!" };
    } catch (error) {
        console.error("Erro ao excluir o médico:", error);
        return { error: "Erro ao excluir o médico. Tente novamente mais tarde." };
    }
};