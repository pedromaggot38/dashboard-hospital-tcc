import EditDoctorForm from "@/components/forms/edit-doctor-form";
import { db } from "@/lib/db";
import { WeekDay } from "@/schemas/doctor";
import { NextPage } from 'next';
import { notFound } from 'next/navigation';
import { z } from "zod";

interface Params {
    crm: string;
}

const DoctorPage: NextPage<{ params: Params }> = async ({ params }) => {
    const doctor = await db.doctor.findUnique({
        where: {
            crm: params.crm,
        },
        include: { schedules: true },
    });

    if (!doctor) {
        return notFound();
    }

    const formattedSchedules = doctor.schedules.map(schedule => ({
        dayOfWeek: schedule.dayOfWeek  as z.infer<typeof WeekDay>,
        startTime: schedule.startTime.toISOString(),
        endTime: schedule.endTime.toISOString(),
    }));

    const doctorData = {
        ...doctor,
        schedules: formattedSchedules,
    };

    return (
        <div className="flex flex-col items-center">
            <EditDoctorForm doctor={doctorData} />
        </div>
    );
};
export default DoctorPage;