export interface settings {
    showAddMore: boolean
};

export interface data {
    [key: string] : {
        inputType: string,
        dataType: string,
        field: string,
        required: boolean,
        value: any
    };
};

export interface editableData {
    columns: any[],
    types: any[],
    names: any[],
    required: any[],
    fields: any[],
    values: any[]
};

export interface message {
    title: string,
    message: string,
    footer?: string
};