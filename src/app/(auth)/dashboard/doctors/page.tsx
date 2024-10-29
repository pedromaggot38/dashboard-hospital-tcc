import { NewDoctorForm } from "@/components/forms/new-doctor-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const DoctorsPage = () => {
    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-6xl px-4">
                <Button
                    asChild
                    className="hover:bg-primary hover:text-white"
                    variant="outline"
                >
                    <Link
                        key="Novo Médico"
                        href="/dashboard/doctors/new-doctor/"
                    >
                        <span>Novo Médico</span>
                        <span className="sr-only">Novo Médico</span>
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export default DoctorsPage