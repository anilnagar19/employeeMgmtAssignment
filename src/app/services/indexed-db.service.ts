import { Injectable, signal, WritableSignal } from '@angular/core';
import { Employee } from '../model/employee.model';
import { EmployeeService } from './employee.service';

@Injectable({
    providedIn: 'root',
})
export class IndexedDbService {
    private dbName = 'employeeDb';
    private dbVersion = 1;
    private db: IDBDatabase;

    employes$: WritableSignal<Employee[]> = signal([]);

    constructor(private employeeService: EmployeeService) {
        this.openDatabase();
    }

    openDatabase(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onsuccess = (event: any) => {
                this.db = request.result;
                console.log('Database opened successfully.');
                resolve();
            };

            request.onupgradeneeded = (event: any) => {
                this.db = event.target.result;
                if (!this.db.objectStoreNames.contains('employees')) {
                    this.db.createObjectStore('employees', {
                        keyPath: 'id',
                        autoIncrement: true,
                    });
                }
            };

            request.onerror = (event: any) => {
                console.error('Error opening IndexedDB:', event.target.error);
            };
        });
    }

    addEmployee(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let employee = this.employeeService.employee();
            if (employee.toDate === undefined) {
                employee.toDate = 'No Date';
            }

            if (!this.db) {
                reject('IndexedDB is not yet open.');
                return;
            }

            const transaction = this.db.transaction(['employees'], 'readwrite');
            const store = transaction.objectStore('employees');
            const request = store.add(employee);

            request.onsuccess = (event: any) => {
                //  employee.id = event.target.result;
                this.getAllEmployees();
                resolve();
            };

            request.onerror = () =>
                reject('Failed to add employee to IndexedDB.');
        });
    }

    deleteEmployee(id: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const transaction = this.db.transaction('employees', 'readwrite');
            const store = transaction.objectStore('employees');

            const request = store.delete(id);

            request.onsuccess = (event) => {
                console.log('Employee deleted successfully:', id);
                this.employes$.update((employes$) =>
                    employes$.filter((item) => item.id !== id)
                );
                resolve();
            };

            request.onerror = (event: any) => {
                console.error('Error deleting employee:', event.target.error);
                reject();
            };
        });
    }

    getAllEmployees(): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            if (!this.db) {
                reject('IndexedDB is not yet open.');
                return;
            }

            const transaction = this.db.transaction(['employees'], 'readonly');
            const store = transaction.objectStore('employees');
            const request = store.getAll();

            request.onsuccess = () => {
                this.employes$.set(request.result);

                resolve(request.result);
            };
            request.onerror = () =>
                reject('Failed to retrieve employees from IndexedDB.');
        });
    }

    updateEmployee(empId: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let employee = this.employeeService.employee();
            const transaction = this.db.transaction('employees', 'readwrite');
            const store = transaction.objectStore('employees');

            const getRequest = store.get(empId);

            getRequest.onsuccess = (event: any) => {
                const existingEmployee = event.target.result;
                if (existingEmployee) {
                    // Update properties of the existing employee object
                    existingEmployee.name = employee.name;
                    existingEmployee.position = employee.position;
                    existingEmployee.fromDate = employee.fromDate;
                    existingEmployee.toDate = employee.toDate;

                    const updateRequest = store.put(existingEmployee);

                    updateRequest.onsuccess = () => {
                        console.log(
                            'Employee updated successfully:',
                            existingEmployee
                        );
                        this.getAllEmployees();
                        resolve();
                    };

                    updateRequest.onerror = (event: any) => {
                        console.error(
                            'Error updating employee:',
                            event.target.error
                        );
                        reject();
                    };
                } else {
                    console.error('Employee not found.');
                    reject();
                }
            };

            getRequest.onerror = (event: any) => {
                console.error('Error retrieving employee:', event.target.error);
                reject();
            };
        });
    }
}
