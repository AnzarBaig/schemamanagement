// import { Schema, Field } from "../types/types";

import { Field, Schema } from "types/types";

interface SchemaConfig {
  collectionName: string;
  schema: {
    fields: Record<string, any>;
  };
}

// Helper function to process field properties
const processFieldProperties = (field: Field) => {
  const baseProperties = {
    type: field.type,
    required: field.required,
  };

  if (field.unique) {
    return { ...baseProperties, unique: field.unique };
  }

  return baseProperties;
};

// Helper function to process nested fields
const processNestedFields = (fields: Field[]) => {
  return fields.reduce(
    (acc, f) => ({
      ...acc,
      [f.name]: {
        type: f.type,
        required: f.required,
        ...(f.ref && { ref: f.ref }),
        ...(f.unique && { unique: f.unique }),
      },
    }),
    {}
  );
};

// Process individual field
export const processField = (field: Field): any => {
  // Handle ref type
  if (field.type === "ref" && field.ref) {
    return {
      type: "ref",
      ref: field.ref,
      required: field.required,
      ...(field.unique && { unique: field.unique }),
    };
  }

  // Handle arrayOfRef type
  if (field.type === "arrayOfRef" && field.ref) {
    return {
      type: "arrayOfRef",
      ref: field.ref,
      required: field.required,
    };
  }

  // Handle object type
  if (field.type === "object" && field.fields) {
    return {
      type: "object",
      required: field.required,
      fields: processNestedFields(field.fields),
    };
  }

  // Handle arrayOfString type
  if (field.type === "arrayOfString") {
    return {
      type: "arrayOfString",
      required: field.required,
    };
  }

  // Handle arrayOfObjects type
  if (field.type === "arrayOfObjects" && field.fields) {
    return {
      type: "arrayOfObjects",
      required: field.required,
      fields: processNestedFields(field.fields),
    };
  }

  // Handle default case
  return processFieldProperties(field);
};

// Main function to generate schema JSON
export const generateSchemaJSON = (
  selectedSchema: Schema | null,
  fields: Field[]
): SchemaConfig | Record<string, never> => {
  if (!selectedSchema) return {};

  const schemaConfig: SchemaConfig = {
    collectionName: selectedSchema.name.toLowerCase(),
    schema: {
      fields: fields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: processField(field),
        }),
        {}
      ),
    },
  };

  return schemaConfig;
};
