'use server'

import * as z from 'zod'
import { db } from "@/lib/db"
import { revalidatePath } from 'next/cache';
import { DoctorSchema } from '@/schemas/doctor';

export const createDoctor = async (values: z.infer<typeof DoctorSchema>) => {
    const validatedFields = DoctorSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Erro ao validar os campos", details: validatedFields.error.errors };
    }

    const { name, state, crm, specialty, email, phone, image, schedules, visibility } = validatedFields.data;

    const existingDoctor = await db.doctor.findFirst({
        where: {
            OR: [
                { crm },
                { email },
                { phone },
            ],
        },
    });

    if (state === undefined) {
        return { error: 'O estado é obrigatório.' };
    }

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
                visibility,
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

export const updateDoctor = async (doctorCrm: string, values: z.infer<typeof DoctorSchema>) => {
    const validatedFields = DoctorSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Erro ao validar os campos", details: validatedFields.error.errors };
    }

    const { name, state, crm, specialty, email, phone, image, schedules, visibility } = validatedFields.data;

    const existingDoctor = await db.doctor.findUnique({
        where: { crm: doctorCrm },
        include: { schedules: true },
    });

    if (!existingDoctor) {
        return { error: "Médico não encontrado!" };
    }

    // Verifica conflitos com outros médicos
    const conflictingDoctor = await db.doctor.findFirst({
        where: {
            OR: [
                { crm: crm !== doctorCrm ? crm : undefined },
                { email, NOT: { crm: doctorCrm } },
                { phone, NOT: { crm: doctorCrm } },
            ],
        },
    });

    if (conflictingDoctor) {
        if (conflictingDoctor.crm === crm) {
            return { error: 'CRM já registrado!' };
        }
        if (conflictingDoctor.email === email) {
            return { error: 'Email já registrado!' };
        }
        if (conflictingDoctor.phone === phone) {
            return { error: 'Telefone já registrado!' };
        }
    }

    try {
        await db.$transaction(async (prisma) => {
            // Atualiza dados do médico sem mexer nos horários
            await prisma.doctor.update({
                where: { crm: doctorCrm },
                data: { name, state, crm, specialty, email, phone, image, visibility },
            });

            for (const schedule of schedules) {
                const existingSchedule = existingDoctor.schedules.find(s => s.dayOfWeek === schedule.dayOfWeek);

                if (existingSchedule) {
                    // Atualiza o horário existente se necessário
                    await prisma.schedule.update({
                        where: { id: existingSchedule.id },
                        data: {
                            startTime: new Date(`2025-01-01T${schedule.startTime}:00Z`),
                            endTime: new Date(`2025-01-01T${schedule.endTime}:00Z`),
                        },
                    });
                } else {
                    // Cria um novo horário se ele não existir para o dia da semana
                    await prisma.schedule.create({
                        data: {
                            doctorId: existingDoctor.id,
                            dayOfWeek: schedule.dayOfWeek,
                            startTime: new Date(`2025-01-01T${schedule.startTime}:00Z`),
                            endTime: new Date(`2025-01-01T${schedule.endTime}:00Z`),
                        },
                    });
                }
            }

            // Remove horários que não estão mais na lista atualizada
            const daysOfWeekToUpdate = schedules.map(schedule => schedule.dayOfWeek);
            const schedulesToRemove = existingDoctor.schedules.filter(
                s => !daysOfWeekToUpdate.includes(s.dayOfWeek)
            );

            for (const schedule of schedulesToRemove) {
                await prisma.schedule.delete({ where: { id: schedule.id } });
            }
        });
    } catch (error) {
        console.error("Erro ao atualizar o médico:", error);
        return { error: "Erro ao atualizar o médico. Tente novamente mais tarde." };
    }

    revalidatePath('/dashboard/doctors');
    return { success: "Médico atualizado com sucesso!" };
};