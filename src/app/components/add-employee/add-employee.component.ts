import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import {
    FormControl,
    FormGroup,
    FormBuilder,
    Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Employee } from '../../model/employee.model';
import { IndexedDbService } from '../../services/indexed-db.service';
import { CalendarModelComponent } from '../calendar-model/calendar-model.component';
import { EmployeeService } from '../../services/employee.service';

@Component({
    selector: 'app-add-employee',
    templateUrl: './add-employee.component.html',
    styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent {
    form: FormGroup;
    empId = '';
    fromCalendar = false;
    toCalendar = false;
    dateControl = new FormControl();
    selectedFromDate: any = '';
    employeeForm: FormGroup;
    constructor(
        public employeeService: EmployeeService,
        private dialog: MatDialog,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private indexedDbService: IndexedDbService,
        private dialogRef: MatDialogRef<AddEmployeeComponent>
    ) {
        this.employeeForm = this.formBuilder.group({
            name: new FormControl('', [
                Validators.required,
                Validators.pattern('[ a-zA-Z]*'),
            ]),
            toDate: new FormControl({ value: '', disabled: true }),
            position: new FormControl('', Validators.required),
            fromDate: new FormControl('', Validators.required),
        });

        if (data.editMode) {
            this.empId = data.employeeData.id;
            this.employeeForm = new FormGroup({
                name: new FormControl(data.employeeData.name),
                position: new FormControl(data.employeeData.position),
                fromDate: new FormControl(data.employeeData.fromDate),
                toDate: new FormControl(data.employeeData.toDate),
            });
        }
    }

    positions: string[] = [
        'Product Designer',
        'Flutter Developer',
        'QA Tester',
        'Product Owner',
    ];

    addEditEmployee(): void {
        if (this.data.editMode) {
            this.indexedDbService
                .updateEmployee(this.empId)
                .then(() => {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Employee Updated Successfully',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    this.dialogRef.close(true);
                })
                .catch((error) => console.error(error));
        } else {
            this.indexedDbService
                .addEmployee()
                .then(() => {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Employee Added Successfully',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    this.dialogRef.close(true);
                })
                .catch((error) => console.error(error));
        }
    }

    closeDialog(): void {
        this.dialogRef.close(false);
    }

    toggleFromCalendar(): void {
        if (this.toCalendar) {
            this.toCalendar = false;
        }
        this.fromCalendar = !this.fromCalendar;
    }

    showDatePicker(dateType: any): void {
        const dialogRef = this.dialog.open(CalendarModelComponent, {
            width: '316px',
            panelClass: 'my-calendar',
            data: {
                dateType: dateType,
                selectedFromDate: this.employeeForm.value.fromDate,
            },
        });

        dialogRef.afterClosed().subscribe(() => {
            if (this.employeeForm.get('toDate')?.value) {
                this.employeeForm.controls['toDate'].setValue('No Date');
            }

            this.employeeForm.controls['fromDate'].setValue(
                this.employeeService.employee().fromDate
            );

            this.employeeForm.controls['toDate'].setValue(
                this.employeeService.employee().toDate
            );

            if (this.employeeService.employee().fromDate.length) {
                this.employeeForm.get('toDate')?.enable();
            }

            let fromDateTimeStamp =
                '' +
                new Date(this.employeeService.employee().fromDate).getTime();

            let toDateTimeStamp =
                '' + new Date(this.employeeService.employee().toDate).getTime();

            if (toDateTimeStamp.length && toDateTimeStamp < fromDateTimeStamp) {
                this.employeeForm.controls['toDate'].setValue('No Date');
            }
        });
    }

    onInputBlur() {
        this.employeeService.setEmployeeData(this.employeeForm.value);
    }
}
