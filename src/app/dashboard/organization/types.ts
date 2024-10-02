export type department = {
  name: string;
  category?: Array<category>;
};

export type createDepartment = {
  name: string;
  category?: Array<string>;
};
export type category = {
  _id?: string;
  name: string;
  subcategory?: Array<string>;
};

export type subcategory = {
  _id?: string;
  name: string;
  report?: Array<string>;
};

export type createSubCategory = {
  name: string;
  report?: Array<string>;
};

export type createCategory = {
  name: string;
  subcategory?: Array<string>;
};
