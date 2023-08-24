import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Employee } from '../../model/employee.model';
import { MatDialog } from '@angular/material/dialog';
import { IndexedDbService } from '../../services/indexed-db.service';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';

@Component({
    selector: 'app-employee-list',
    templateUrl: './employee-list.component.html',
    styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
    editMode: boolean = false;
    employes$ = this.indexedDBService.employes$;

    displayedColumns: string[] = ['name', 'position', 'from', 'to', 'actions'];
    colorList: string[] = [
        '#f44336',
        '#e91e63',
        '#9c27b0',
        '#1ea1f1',
        '#17a2b8',
    ];

    constructor(
        private dialog: MatDialog,
        private indexedDBService: IndexedDbService
    ) {}

    ngOnInit(): void {
        this.indexedDBService.openDatabase().then(() => {
            this.indexedDBService
                .getAllEmployees()
                .then(() => {
                    console.log('show list');
                })
                .catch((error) => console.error(error));
        });
    }

    editEmployee(employee: Employee): void {
        this.dialog.open(AddEmployeeComponent, {
            height: '25vw',
            width: '50vw',
            data: {
                editMode: true,
                employeeData: employee,
            },
        });
    }

    deleteEmployee(employee: Employee): void {
        Swal.fire({
            title: 'Confirmation',
            text: ' Are you sure you want to delete this employee ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
        }).then((result) => {
            if (result.isConfirmed) {
                this.indexedDBService.deleteEmployee(employee.id).then(() => {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Employee Deleted Successfully',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                });
            }
        });
    }

    getInitials(name: string): string {
        const words = name.split(' ').slice(0, 2);
        const initials = words.map((word) => word.charAt(0)).join('');
        return initials.toUpperCase();
    }

    getBackgroundColor(name: string): string {
        const hash = name
            .split('')
            .reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const index = hash % this.colorList.length;
        return this.colorList[index];
    }

    openAddEmployeeDialog(): void {
        this.dialog.open(AddEmployeeComponent, {
            width: '70vw',
            data: {
                editMode: false,
            },
        });
    }

    hidePreviousEmployee(row: any): boolean {
        return row.toDate !== 'No Date';
    }

    hideCurrentEmployee(row: any): boolean {
        return row.toDate === 'No Date';
    }

    getCurrentEmployee() {
        let currentEmployees = this.employes$().filter((emp) => {
            return emp.toDate === 'No Date';
        });
        return currentEmployees;
    }

    getPreviousEmployee() {
        let previousEmployees = this.employes$().filter((emp) => {
            return emp.toDate !== 'No Date';
        });
        return previousEmployees;
    }
}
