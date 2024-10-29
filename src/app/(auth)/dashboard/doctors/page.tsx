import DoctorsTable from "@/components/dashboard/doctorsTable"
import { NewDoctorForm } from "@/components/forms/new-doctor-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const DoctorsPage = () => {
    return (
        <div className="flex flex-col items-center">
            <div>
                <DoctorsTable />
            </div>
        </div>
    )
}

export default DoctorsPage