// Base types
export type BaseMongooseType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "ref"
  | "arrayOfRef";

export type ComplexMongooseType =
  | "array"
  | "object"
  | "arrayOfString"
  | "arrayOfObjects";

export type MongooseType = BaseMongooseType | ComplexMongooseType;

// Field types
export type ObjectField = {
  name: string;
  type: BaseMongooseType;
  required: boolean;
  unique?: boolean;
  default?: string;
  ref?: string;
};

export type Field = {
  name: string;
  type: MongooseType;
  required: boolean;
  unique?: boolean;
  default?: string;
  ref?: string | string[];
  items?: {
    type: BaseMongooseType;
    fields?: ObjectField[];
  };
  fields?: ObjectField[];
};

// Schema types
export type Schema = {
  id: number;
  name: string;
  fields: Field[];
};

export type NestedFieldEditorProps = {
  fields: ObjectField[];
  onFieldsChange: (fields: ObjectField[]) => void;
};
