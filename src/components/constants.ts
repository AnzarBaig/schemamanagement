// const basePath = "http://localhost:8083/api/";
const basePath = "http://165.22.215.163:8083/api/";
const createSchema = "create-schemas";
const getSchema = "schemas";
const updateSchema = "update-schemas";
const deleteSchema = "delete-schemas";

export const createSchemaUrl = `${basePath}${createSchema}`;
export const getSchemaUrl = `${basePath}${getSchema}`;
export const updateSchemaUrl = `${basePath}${updateSchema}`;
export const deleteSchemaUrl = `${basePath}${deleteSchema}`;
