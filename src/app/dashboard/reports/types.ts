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
    field: string;
    value: string
}