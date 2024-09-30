export type fieldType = {
    name: string;
};
export type fields = {
    name: string;
    filtered: boolean;
    type: fieldType;
};

export type report = {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
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