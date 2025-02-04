import React, { useState, useEffect } from "react";
import { Field, Schema } from "types/types";
import { createSchemaUrl, getSchemaUrl } from "components/constants";
import toast, { Toaster } from "react-hot-toast";
import SchemaList from "components/SchemaList";
import FieldEditor from "components/FieldEditor";
import SchemaPreview from "components/SchemaPreview";

const SchemaManagement: React.FC = () => {
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<Schema | null>(null);
  const [schemaName, setSchemaName] = useState<string>("");
  const [fields, setFields] = useState<Field[]>([]);
  const [currentField, setCurrentField] = useState<Field>({
    name: "",
    type: "string",
    required: false,
    unique: false,
  });

  useEffect(() => {
    fetchSchemas();
  }, []);

  const fetchSchemas = async () => {
    try {
      const response = await fetch(getSchemaUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collectionName: "",
          payload: {
            page: 1,
            limit: 10,
            searchText: {},
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        const transformedSchemas = data.schemas.map((schema: any) => ({
          id: schema._id,
          name: schema.collectionName,
          fields: transformFields(schema.schema.fields),
        }));
        setSchemas(transformedSchemas);
      }
    } catch (error) {
      console.error("Error fetching schemas:", error);
    }
  };

  const transformFields = (apiFields: any) => {
    return Object.entries(apiFields).map(([name, field]: [string, any]) => ({
      name,
      type: field.type,
      required: field.required || false,
      unique: field.unique || false,
      default: field.default,
      ref: field.ref,
      fields: field.fields
        ? Object.entries(field.fields).map(
            ([fieldName, fieldValue]: [string, any]) => ({
              name: fieldName,
              ...fieldValue,
            })
          )
        : undefined,
      items: field.items,
    }));
  };

  const handleAddSchema = () => {
    if (schemaName.trim()) {
      const newSchema: Schema = {
        id: Date.now(),
        name: schemaName,
        fields: [],
      };
      setSchemas([...schemas, newSchema]);
      setSchemaName("");
      setSelectedSchema(newSchema);
      setFields([]);
    }
  };

  const handleAddField = () => {
    if (currentField.name.trim() && selectedSchema) {
      setFields([...fields, { ...currentField }]);
      setCurrentField({
        name: "",
        type: "string",
        required: false,
        unique: false,
      });
    }
  };

  const handleSaveConfig = async (schemaConfig: any) => {
    if (!selectedSchema) {
      toast.error("No schema selected");
      return;
    }

    try {
      const response = await fetch(createSchemaUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(schemaConfig),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Schema saved successfully!");
      } else {
        toast.error(data.message || "Failed to save schema");
      }
    } catch (error) {
      console.error("Error saving schema:", error);
      toast.error("Failed to save schema");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mongoose Schema Management</h1>

        <div className="flex justify-center gap-4">
          <SchemaList
            schemas={schemas}
            schemaName={schemaName}
            selectedSchema={selectedSchema}
            onSchemaNameChange={setSchemaName}
            onAddSchema={handleAddSchema}
            onSelectSchema={(schema) => {
              setSelectedSchema(schema);
              setFields(schema.fields);
            }}
            onSchemaUpdate={fetchSchemas}
          />

          {selectedSchema && (
            <FieldEditor
              selectedSchema={selectedSchema}
              currentField={currentField}
              fields={fields}
              onCurrentFieldChange={setCurrentField}
              onAddField={handleAddField}
              onRemoveField={(index) => {
                const newFields = [...fields];
                newFields.splice(index, 1);
                setFields(newFields);
              }}
              onFieldsChange={setFields}
            />
          )}
          {selectedSchema && (
            <SchemaPreview
              selectedSchema={selectedSchema}
              fields={fields}
              onSave={handleSaveConfig}
            />
          )}

          <Toaster />
        </div>
      </div>
    </div>
  );
};

export default SchemaManagement;
