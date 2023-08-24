import { Injectable, signal, WritableSignal } from '@angular/core';
import { Employee } from '../model/employee.model';
@Injectable({
    providedIn: 'root',
})
export class EmployeeService {
    employeeSignal = signal({});
    employee: any = this.employeeSignal.asReadonly();

    constructor() {}

    setEmployeeData(empData: any) {
        this.employeeSignal.mutate((value: any) => {
            value.name = empData.name;
            value.toDate = empData.toDate;
            value.position = empData.position;
            value.fromDate = empData.fromDate;
        });
    }
}
