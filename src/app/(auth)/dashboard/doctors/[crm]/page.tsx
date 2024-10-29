import { db } from "@/lib/db";
import { NextPage } from 'next';
import { notFound } from 'next/navigation';

interface Params {
    crm: string;
}

const DoctorPage: NextPage<{ params: Params }> = async ({ params }) => {
    const doctor = await db.doctor.findUnique({
        where: {
            crm: params.crm,
        },
    });

    if (!doctor) {
        return notFound();
    }

    return (
        <div className="flex flex-col items-center">
            {/*<EditDoctorForm doctor={doctor} crm={doctor.crm} />*/}
        </div>
    );
};

export default DoctorPage;