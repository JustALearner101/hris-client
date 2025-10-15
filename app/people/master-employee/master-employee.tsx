import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getAll as getAllEmployees } from "@/app/api/employees/data";
import EmployeeTableCard from "@/components/people-component/employess/employee-table";

export default function MasterEmployeePage() {
    const employees = getAllEmployees()

    return (
        <main className="mx-auto max-w-[1200px] p-4 md:p-6">
            <section aria-label="Master Employee" className="space-y-4">
                <header className="space-y-2">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">Employee Management</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Master Employee</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="text-2xl font-semibold tracking-tight text-pretty">Master Employee</h1>
                    <p className="text-sm text-muted-foreground">Manage all employees: create, view, edit, and delete.</p>
                </header>

                {/* Table card */}
                <EmployeeTableCard />
            </section>
        </main>
    )
}