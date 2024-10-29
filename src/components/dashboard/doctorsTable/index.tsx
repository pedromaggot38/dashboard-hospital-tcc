import { db } from "@/lib/db";
import { Doctors } from "./columns";

async function getData(): Promise<Doctors[]> {
    const doctors = await db.doctor.findMany({
        select: {
            id: true,
            name: true,
            specialty: true,
            state: true,
            crm: true,
            phone: true,
            email: true,
            image: true,
            createdAt: true,
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
        state: doctor.state,
        crm: doctor.crm,
        phone: doctor.phone ?? "",
        email: doctor.email ?? "",
        image: doctor.image ?? "",
        createdAt: doctor.createdAt,
        schedules: doctor.schedules.map(schedule => ({
            dayOfWeek: schedule.dayOfWeek as string,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
        })),
    }));
}

const ArticlesTable = async () => {
    const data = await getData()

    return (
        <div>
            {/*<DataTable columns={columns} data={data} />*/}
        </div>
    );
};

export default ArticlesTable;
