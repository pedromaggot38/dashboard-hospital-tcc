import { db } from "@/lib/db";
import { columns, Doctors } from "./columns";
import { DataTable } from "./data-table";

async function getDoctorsData(): Promise<Doctors[]> {
    const doctors = await db.doctor.findMany({
        select: {
            id: true,
            name: true,
            specialty: true,
            state: true,
            crm: true,
            phone: true,
            email: true,
            createdAt: true,
            visibility: true,
            schedules: {
                select: {
                    dayOfWeek: true,
                    startTime: true,
                    endTime: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return doctors.map((doctor) => ({
        id: doctor.id,
        name: doctor.name,
        specialty: doctor.specialty,
        state: doctor.state as string,
        crm: doctor.crm,
        createdAt: doctor.createdAt,
        visibility: doctor.visibility,
        phone: doctor.phone ?? "",
        email: doctor.email ?? "",
        schedules: doctor.schedules.map(schedule => ({
            dayOfWeek: schedule.dayOfWeek as string,
            startTime: schedule.startTime.toISOString(),
            endTime: schedule.endTime.toISOString(),
        })),
    }));
}

const DoctorsTable = async () => {
    const data = await getDoctorsData();

    return (
        <div>
            <DataTable columns={columns} data={data} />
        </div>
    );
};

export default DoctorsTable;
