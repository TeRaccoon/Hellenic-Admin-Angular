import { Injectable } from '@angular/core';
import { FormService } from '../components/form/service';
import { DataService } from './data.service';
import { CREDIT_NOTE_COLUMNS } from '../common/constants';
import { DEFAULT_DISABLED_WIDGET_DATA } from '../common/types/widget/const';

@Injectable({
    providedIn: 'root',
})
export class TableOptionsService {

    constructor(private formService: FormService, private dataService: DataService) { }

    canPrint(selectedRows: any[], currentRow: any) {
        if (selectedRows.length < 1) {
            this.showErrorMessage('Please select an invoice before trying to print!');
            return false;
        }

        for (const selectedRow of selectedRows) {
            if (currentRow.warehouse_id == null) {
                this.showErrorMessage(
                    `Invoice ${selectedRow} is missing a warehouse! Please assign a warehouse before attempting to print.`,
                );
                return false;
            }

            if (currentRow.customer_id == null) {
                this.showErrorMessage(
                    `Invoice ${selectedRow} is missing a customer! Please assign a customer before attempting to print.`,
                );
                return false;
            }
        }

        return true;
    }

    canDelete(currentRow: any, tableName: string) {
        switch (tableName) {
            case 'customer_payments':
                if (currentRow['linked_payment_id'] != null) {
                    this.formService.setMessageFormData({
                        title: 'Error',
                        message:
                            'You cannot delete this payment because it is linked. Please delete or alter the linked payment instead!',
                    });
                    return false;
                }
                break;

            case 'invoices':
                if (currentRow['status'] == 'Complete') {
                    this.formService.setMessageFormData({
                        title: 'Error',
                        message:
                            'You cannot delete this invoice because it has been marked completed!',
                    });
                    return false;
                }
                break;
        }
        return true;
    }

    async calculateDistance(selectedRows: any[], row: any) {
        if (selectedRows.length !== 1) {
            this.showWarningMessage(
                'Please select a single row to calculate the distance!',
            );
            return;
        }

        const invoice_id = selectedRows[0];

        if (!row['warehouse_id']) {
            this.showWarningMessage(
                "This invoice doesn't have a designated warehouse. To calculate the distance please assign a warehouse!",
            );
            return;
        }

        if (!row['customer_id']) {
            this.showWarningMessage(
                "This invoice doesn't have a designated customer. To calculate the distance please assign a customer!",
            );
            return;
        }

        let coordinates = await this.dataService.processGet('calculate-distance', {
            invoice_id: invoice_id,
            warehouse_id: row['warehouse_id'],
        });

        this.handleCoordinatesResponse(coordinates);
    }

    handleCoordinatesResponse(coordinates: any) {
        if (
            !coordinates ||
            !coordinates['customer_coordinates'] ||
            !coordinates['warehouse_coordinates']
        ) {
            this.showErrorMessage(
                'There was an error getting the coordinates! One of the postcodes may not be in the database.',
            );
            return;
        }

        if (
            !coordinates['customer_postcode'] ||
            !coordinates['warehouse_postcode']
        ) {
            this.showErrorMessage(
                "There was an error getting the postcodes! Either the warehouse or the customer doesn't have a postcode.",
            );
            return;
        }

        const distance = this.calculateHaversine(
            coordinates['customer_coordinates'],
            coordinates['warehouse_coordinates'],
        );
        this.formService.setMessageFormData({
            title: 'Distance',
            message: `The distance between the warehouse at ${coordinates['warehouse_postcode']} and the customer postcode at ${coordinates['customer_postcode']} in a straight line is ${distance}km`,
        });
    }

    calculateHaversine(coord1: any, coord2: any): string {
        const R = 6371000; // Earth's radius in meters
        const lat1Rad = coord1.latitude * (Math.PI / 180);
        const lat2Rad = coord2.latitude * (Math.PI / 180);
        const deltaLat = (coord2.latitude - coord1.latitude) * (Math.PI / 180);
        const deltaLon = (coord2.longitude - coord1.longitude) * (Math.PI / 180);

        const a =
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1Rad) *
            Math.cos(lat2Rad) *
            Math.sin(deltaLon / 2) *
            Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = (R * c) / 1000; // Distance in km
        return distance.toFixed(2);
    }

    performDelete(ids: number[], tableName: string) {
        this.formService.setSelectedTable(tableName);
        this.formService.setDeleteFormIds(ids);
        this.formService.showDeleteForm();
        this.formService.setReloadType('hard');
    }

    prepareAddFormService(table: string) {
        this.formService.setSelectedTable(table);
        this.formService.showAddForm();
        this.formService.setReloadType('hard');
    }

    addRow(editable: any, values: any, tableName: string) {
        var addFormData = {
            columns: editable.columns,
            types: editable.types,
            names: editable.names,
            required: editable.required,
            fields: editable.fields,
            values: values,
        };
        this.formService.processAddFormData(
            addFormData,
            null,
            this.formService.constructFormSettings(tableName),
        );
        this.formService.setSelectedTable(String(tableName));
        this.formService.showAddForm();
        this.formService.setReloadType('hard');
    }

    showWarningMessage(message: string) {
        this.formService.setMessageFormData({ title: 'Warning!', message });
    }

    showErrorMessage(message: string) {
        this.formService.setMessageFormData({ title: 'Error!', message });
    }

    getAccountNumberKey(tableName: string) {
        return tableName == 'customers'
            ? 'account_number'
            : 'account_code';
    }

    async creditNoteSearch(tableName: string, data: any, id: string) {
        let tableColumns = CREDIT_NOTE_COLUMNS;
        let row = data.filter((row: any) => row.id == id)[0];

        let reference;
        let idColumnName;
        let query;

        if (tableName == 'suppliers') {
            query = 'credit-note-search-supplier';
            reference = row['account_name'];
            idColumnName = 'Supplier';
        } else {
            query = 'credit-note-search-invoice;'
            reference = row['reference'];
            idColumnName = 'Invoice';
        }

        let tableRows = await this.dataService.processGet(
            query,
            { filter: id },
            true,
        );
        let title = `Credit Notes from ${reference}`;

        this.dataService.storeWidgetData({
            headers: tableColumns,
            rows: tableRows,
            tableName: 'credit_notes',
            title: title,
            idData: { id: id, columnName: idColumnName },
            query: query,
            disabled: DEFAULT_DISABLED_WIDGET_DATA,
            extra: undefined,
        });
        this.formService.showWidget();
    }
}
