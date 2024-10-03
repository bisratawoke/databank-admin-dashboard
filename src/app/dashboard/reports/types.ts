export type fieldType = {
    name: string;
};
export type fields = {
    _id?: string;
    name: string;
    filtered: boolean;
    type: fieldType;
};

export type report = {
    _id?: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    fields: Array<fields>;
    data: Array<Data>;
};

export type transformedReport = {
    _id?: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    field: Array<fields>;
    item: Array<Data>;
};

export type reportsWithFields = {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    fields: Array<fields>;
};
export type reportsWithData = {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    data: Array<Data>;
};

export type Data = {
    _id?: string;
    field: string;
    value: string
}

export type FileObject = {
    name: string; // or other properties you expect
    type: string;
    // Add any other properties you need
}