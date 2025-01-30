// something hcaed amnbdsfahsd fkjahsjd

// import React, { useState, useEffect, useRef } from "react";
// import { PlusCircle, Save, Plus } from "lucide-react";
// import JSONEditor, {
//   JSONEditorOptions,
//   ParseError,
//   SchemaValidationError,
// } from "jsoneditor";
// import "jsoneditor/dist/jsoneditor.css";

// interface Schema {
//   id: number;
//   name: string;
//   fields: Field[];
// }

// interface Field {
//   name: string;
//   type: MongooseType;
//   required: boolean;
//   unique: boolean;
//   default?: string;
//   ref?: string;
// }

// type MongooseType = "String" | "Number" | "Boolean" | "Date" | "ObjectId";

// interface SchemaConfig {
//   name: string;
//   schema: {
//     fields: {
//       [key: string]: {
//         type: MongooseType;
//         required: boolean;
//         unique?: boolean;
//         default?: string;
//         ref?: string;
//       };
//     };
//   };
//   timestamp: boolean;
//   collection: string;
// }

// const SchemaManagement: React.FC = () => {
//   const [schemas, setSchemas] = useState<Schema[]>([]);
//   const [selectedSchema, setSelectedSchema] = useState<Schema | null>(null);
//   const [schemaName, setSchemaName] = useState<string>("");
//   const [fields, setFields] = useState<Field[]>([]);
//   const [currentField, setCurrentField] = useState<Field>({
//     name: "",
//     type: "String",
//     required: false,
//     unique: false,
//     default: "",
//     ref: "",
//   });

//   const jsonEditorRef = useRef<HTMLDivElement>(null);
//   const editorInstanceRef = useRef<JSONEditor | null>(null);

//   const mongooseTypes: MongooseType[] = [
//     "String",
//     "Number",
//     "Boolean",
//     "Date",
//     "ObjectId",
//   ];

//   useEffect(() => {
//     // Initialize JSONEditor
//     if (jsonEditorRef.current && !editorInstanceRef.current) {
//       const options: JSONEditorOptions = {
//         mode: "code",
//         modes: ["code", "form", "tree"],
//         onChangeText: function (jsonString: string) {
//           try {
//             const json = JSON.parse(jsonString);
//             // Handle the updated JSON here if needed
//             console.log("Valid JSON:", json);
//           } catch (err) {
//             console.log("Invalid JSON");
//           }
//         },
//         onValidationError: function (
//           errors: readonly (SchemaValidationError | ParseError)[]
//         ) {
//           console.log("Validation errors:", errors);
//         },
//         theme: "ace/theme/github",
//         indentation: 2,
//         enableSort: false,
//         enableTransform: false,
//       };

//       editorInstanceRef.current = new JSONEditor(
//         jsonEditorRef.current,
//         options
//       );
//     }

//     // Cleanup on unmount
//     return () => {
//       if (editorInstanceRef.current) {
//         editorInstanceRef.current.destroy();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     // Update JSONEditor content whenever fields change
//     if (editorInstanceRef.current && selectedSchema) {
//       const schemaJSON = generateSchemaJSON();
//       editorInstanceRef.current.set(schemaJSON);
//     }
//   }, [fields, selectedSchema]);

//   const generateSchemaJSON = (): SchemaConfig | {} => {
//     if (!selectedSchema) return {};

//     const schemaConfig: SchemaConfig = {
//       name: selectedSchema.name,
//       schema: {
//         fields: fields.reduce((acc, field) => {
//           acc[field.name] = {
//             type: field.type,
//             required: field.required,
//             ...(field.unique && { unique: true }),
//             ...(field.default && { default: field.default }),
//             ...(field.type === "ObjectId" && field.ref && { ref: field.ref }),
//           };
//           return acc;
//         }, {} as SchemaConfig["schema"]["fields"]),
//       },
//       timestamp: true,
//       collection: selectedSchema.name.toLowerCase(),
//     };

//     return schemaConfig;
//   };

//   const handleAddSchema = (): void => {
//     if (schemaName.trim()) {
//       const newSchema: Schema = {
//         id: Date.now(),
//         name: schemaName,
//         fields: [],
//       };
//       setSchemas([...schemas, newSchema]);
//       setSchemaName("");
//       setSelectedSchema(newSchema);
//       setFields([]);

//       if (editorInstanceRef.current) {
//         editorInstanceRef.current.set({});
//       }
//     }
//   };

//   const handleAddField = (): void => {
//     if (currentField.name.trim() && selectedSchema) {
//       const newField: Field = { ...currentField };

//       // Clean up the field object based on type
//       if (newField.type !== "ObjectId") {
//         delete newField.ref;
//       }

//       if (!newField.default) {
//         delete newField.default;
//       }

//       setFields([...fields, newField]);
//       setCurrentField({
//         name: "",
//         type: "String",
//         required: false,
//         unique: false,
//         default: "",
//         ref: "",
//       });
//     }
//   };

//   const handleSaveConfig = (): void => {
//     if (selectedSchema && editorInstanceRef.current) {
//       try {
//         const schemaConfig = editorInstanceRef.current.get();
//         console.log("Generated Schema:", schemaConfig);
//         // console.log("Selected Schema:", selectedSchema);

//         // Here you would typically make your API call

//         fetch("http://localhost:3006/schemas", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(schemaConfig),
//         })
//           .then((res) => res.json())
//           .then((data) => console.log("API Response:", data))
//           .catch((err) => console.error("API Error:", err));
//       } catch (error) {
//         console.error("Invalid JSON in editor");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-2xl font-bold mb-6">Mongoose Schema Management</h1>

//         <div className="flex gap-4">
//           {/* Left Column - Schema List */}
//           <div className="w-1/4 bg-white rounded-lg shadow p-4">
//             <div className="flex items-center gap-2 mb-4">
//               <input
//                 type="text"
//                 placeholder="Enter schema name"
//                 className="flex-1 p-2 border rounded"
//                 value={schemaName}
//                 onChange={(e) => setSchemaName(e.target.value)}
//               />
//               <button
//                 onClick={handleAddSchema}
//                 className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
//               >
//                 <PlusCircle className="w-4 h-4" />
//                 Add
//               </button>
//             </div>

//             <div className="space-y-2">
//               {schemas.map((schema) => (
//                 <div
//                   key={schema.id}
//                   className={`p-3 rounded cursor-pointer ${
//                     selectedSchema?.id === schema.id
//                       ? "bg-blue-100 border-blue-500"
//                       : "bg-gray-50 hover:bg-gray-100"
//                   }`}
//                   onClick={() => setSelectedSchema(schema)}
//                 >
//                   {schema.name}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Middle Column - Field Editor */}
//           <div className="w-1/3 bg-white rounded-lg shadow p-4">
//             <h2 className="text-xl font-semibold mb-4">
//               {selectedSchema
//                 ? `Add Fields: ${selectedSchema.name}`
//                 : "Select a schema"}
//             </h2>

//             {selectedSchema && (
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Field Name
//                   </label>
//                   <input
//                     type="text"
//                     value={currentField.name}
//                     onChange={(e) =>
//                       setCurrentField({ ...currentField, name: e.target.value })
//                     }
//                     className="w-full p-2 border rounded"
//                     placeholder="Enter field name"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Type</label>
//                   <select
//                     value={currentField.type}
//                     onChange={(e) =>
//                       setCurrentField({
//                         ...currentField,
//                         type: e.target.value as MongooseType,
//                       })
//                     }
//                     className="w-full p-2 border rounded"
//                   >
//                     {mongooseTypes.map((type) => (
//                       <option key={type} value={type}>
//                         {type}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {currentField.type === "ObjectId" && (
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Reference Model
//                     </label>
//                     <input
//                       type="text"
//                       value={currentField.ref}
//                       onChange={(e) =>
//                         setCurrentField({
//                           ...currentField,
//                           ref: e.target.value,
//                         })
//                       }
//                       className="w-full p-2 border rounded"
//                       placeholder="Enter model name"
//                     />
//                   </div>
//                 )}

//                 <div className="flex gap-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Required
//                     </label>
//                     <input
//                       type="checkbox"
//                       checked={currentField.required}
//                       onChange={(e) =>
//                         setCurrentField({
//                           ...currentField,
//                           required: e.target.checked,
//                         })
//                       }
//                       className="rounded"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-1">
//                       Unique
//                     </label>
//                     <input
//                       type="checkbox"
//                       checked={currentField.unique}
//                       onChange={(e) =>
//                         setCurrentField({
//                           ...currentField,
//                           unique: e.target.checked,
//                         })
//                       }
//                       className="rounded"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Default Value
//                   </label>
//                   <input
//                     type="text"
//                     value={currentField.default}
//                     onChange={(e) =>
//                       setCurrentField({
//                         ...currentField,
//                         default: e.target.value,
//                       })
//                     }
//                     className="w-full p-2 border rounded"
//                     placeholder="Enter default value (optional)"
//                   />
//                 </div>

//                 <button
//                   onClick={handleAddField}
//                   className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center gap-1"
//                 >
//                   <Plus className="w-4 h-4" />
//                   Add Field
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Right Column - JSONEditor Preview */}
//           <div className="w-5/12 bg-white rounded-lg shadow p-4">
//             <div className="mb-4 flex justify-between items-center">
//               <h2 className="text-xl font-semibold">Schema Preview</h2>
//               <button
//                 onClick={handleSaveConfig}
//                 disabled={!selectedSchema || fields.length === 0}
//                 className={`p-2 rounded flex items-center gap-1 ${
//                   selectedSchema && fields.length > 0
//                     ? "bg-green-500 text-white hover:bg-green-600"
//                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 }`}
//               >
//                 <Save className="w-4 h-4" />
//                 Save Schema
//               </button>
//             </div>

//             <div ref={jsonEditorRef} className="h-96 border rounded" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SchemaManagement;

import React, { useState, useEffect, useRef } from "react";
import {
  PlusCircle,
  Save,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";

type BaseMongooseType = "String" | "Number" | "Boolean" | "Date" | "ObjectId";
type ComplexMongooseType = "Array" | "Object" | "ArrayOfObjects";
type MongooseType = BaseMongooseType | ComplexMongooseType;

interface ObjectField {
  name: string;
  type: BaseMongooseType;
  required: boolean;
  unique?: boolean;
  default?: string;
  ref?: string;
}

interface Field {
  name: string;
  type: MongooseType;
  required: boolean;
  unique?: boolean;
  default?: string;
  ref?: string;
  items?: {
    type: BaseMongooseType;
    fields?: ObjectField[];
  };
  fields?: ObjectField[];
}

interface Schema {
  id: number;
  name: string;
  fields: Field[];
}

interface NestedFieldEditorProps {
  fields: ObjectField[];
  onFieldsChange: (fields: ObjectField[]) => void;
}

const NestedFieldEditor: React.FC<NestedFieldEditorProps> = ({
  fields,
  onFieldsChange,
}) => {
  const [newField, setNewField] = useState<ObjectField>({
    name: "",
    type: "String",
    required: false,
    unique: false,
  });

  const handleAddField = () => {
    if (newField.name.trim()) {
      onFieldsChange([...fields, { ...newField }]);
      setNewField({
        name: "",
        type: "String",
        required: false,
        unique: false,
      });
    }
  };

  const handleRemoveField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    onFieldsChange(updatedFields);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {fields.map((field, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-gray-50 p-2 rounded"
          >
            <div className="flex-1">
              <div className="text-sm font-medium">{field.name}</div>
              <div className="text-xs text-gray-500">
                Type: {field.type}, {field.required ? "Required" : "Optional"}
                {field.unique ? ", Unique" : ""}
              </div>
            </div>
            <button
              onClick={() => handleRemoveField(index)}
              className="p-1 text-red-500 hover:bg-red-50 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          value={newField.name}
          onChange={(e) => setNewField({ ...newField, name: e.target.value })}
          placeholder="Field name"
          className="p-2 border rounded"
        />
        <select
          value={newField.type}
          onChange={(e) =>
            setNewField({
              ...newField,
              type: e.target.value as BaseMongooseType,
            })
          }
          className="p-2 border rounded"
        >
          {["String", "Number", "Boolean", "Date", "ObjectId"].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={newField.required}
            onChange={(e) =>
              setNewField({ ...newField, required: e.target.checked })
            }
            className="rounded"
          />
          <span className="text-sm">Required</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={newField.unique}
            onChange={(e) =>
              setNewField({ ...newField, unique: e.target.checked })
            }
            className="rounded"
          />
          <span className="text-sm">Unique</span>
        </label>
      </div>

      {newField.type === "ObjectId" && (
        <input
          type="text"
          value={newField.ref || ""}
          onChange={(e) => setNewField({ ...newField, ref: e.target.value })}
          placeholder="Reference Model"
          className="w-full p-2 border rounded"
        />
      )}

      <button
        onClick={handleAddField}
        disabled={!newField.name.trim()}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-1"
      >
        <Plus className="w-4 h-4" />
        Add Nested Field
      </button>
    </div>
  );
};

const SchemaManagement: React.FC = () => {
  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [selectedSchema, setSelectedSchema] = useState<Schema | null>(null);
  const [schemaName, setSchemaName] = useState<string>("");
  const [fields, setFields] = useState<Field[]>([]);
  const [currentField, setCurrentField] = useState<Field>({
    name: "",
    type: "String",
    required: false,
    unique: false,
  });

  const jsonEditorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<JSONEditor | null>(null);

  const mongooseTypes: MongooseType[] = [
    "String",
    "Number",
    "Boolean",
    "Date",
    "ObjectId",
    "Array",
    "Object",
    "ArrayOfObjects",
  ];

  useEffect(() => {
    if (jsonEditorRef.current && !editorInstanceRef.current) {
      const options = {
        mode: "code",
        modes: ["code", "form", "tree"],
        onChangeText: function (jsonString: string) {
          try {
            const json = JSON.parse(jsonString);
            console.log("Valid JSON:", json);
          } catch (err) {
            console.log("Invalid JSON");
          }
        },
        onValidationError: function (errors: any[]) {
          console.log("Validation errors:", errors);
        },
      };

      editorInstanceRef.current = new JSONEditor(
        jsonEditorRef.current,
        // @ts-ignore
        options
      );
    }

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (editorInstanceRef.current && selectedSchema) {
      const schemaJSON = generateSchemaJSON();
      editorInstanceRef.current.set(schemaJSON);
    }
  }, [fields, selectedSchema]);

  const generateSchemaJSON = () => {
    if (!selectedSchema) return {};

    const processField = (field: Field): any => {
      // For Array type
      if (field.type === "Array") {
        return {
          type: "Array",
          structure: {
            type: field.items?.type || "String",
            required: field.required,
          },
        };
      }

      // For Object type
      if (field.type === "Object") {
        const objectFields = field.fields?.reduce(
          (acc, f) => ({
            ...acc,
            [f.name]: {
              type: f.type,
              required: f.required,
              ...(f.unique && { unique: true }),
              ...(f.default && { default: f.default }),
              ...(f.type === "ObjectId" && f.ref && { ref: f.ref }),
            },
          }),
          {}
        );

        return {
          type: "Object",
          structure: objectFields,
          required: field.required,
        };
      }

      // For Array of Objects
      if (field.type === "ArrayOfObjects") {
        const objectFields = field.items?.fields?.reduce(
          (acc, f) => ({
            ...acc,
            [f.name]: {
              type: f.type,
              required: f.required,
              ...(f.unique && { unique: true }),
              ...(f.default && { default: f.default }),
              ...(f.type === "ObjectId" && f.ref && { ref: f.ref }),
            },
          }),
          {}
        );

        return {
          type: "ArrayOfObjects",
          structure: {
            type: objectFields,
          },
          required: field.required,
        };
      }

      // For basic types
      return {
        type: field.type,
        structure: {
          required: field.required,
          ...(field.unique && { unique: true }),
          ...(field.default && { default: field.default }),
          ...(field.type === "ObjectId" && field.ref && { ref: f.ref }),
        },
      };
    };

    const schemaConfig = {
      name: selectedSchema.name,
      schema: {
        fields: fields.reduce(
          (acc, field) => ({
            ...acc,
            [field.name]: processField(field),
          }),
          {}
        ),
      },
      timestamp: true,
      collection: selectedSchema.name.toLowerCase(),
    };

    return schemaConfig;
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

      if (editorInstanceRef.current) {
        editorInstanceRef.current.set({});
      }
    }
  };

  const handleAddField = () => {
    if (currentField.name.trim() && selectedSchema) {
      setFields([...fields, { ...currentField }]);
      setCurrentField({
        name: "",
        type: "String",
        required: false,
        unique: false,
      });
    }
  };

  const handleSaveConfig = () => {
    if (selectedSchema && editorInstanceRef.current) {
      try {
        const schemaConfig = editorInstanceRef.current.get();
        console.log("Saving schema:", schemaConfig);

        fetch("http://localhost:3006/schemas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(schemaConfig),
        })
          .then((res) => res.json())
          .then((data) => console.log("API Response:", data))
          .catch((err) => console.error("API Error:", err));
      } catch (error) {
        console.error("Invalid JSON in editor");
      }
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mongoose Schema Management</h1>

        <div className="flex gap-4">
          {/* Left Column - Schema List */}
          <div className="w-1/4 bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Enter schema name"
                className="flex-1 p-2 border rounded"
                value={schemaName}
                onChange={(e) => setSchemaName(e.target.value)}
              />
              <button
                onClick={handleAddSchema}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
              >
                <PlusCircle className="w-4 h-4" />
                Add
              </button>
            </div>

            <div className="space-y-2">
              {schemas.map((schema) => (
                <div
                  key={schema.id}
                  className={`p-3 rounded cursor-pointer ${
                    selectedSchema?.id === schema.id
                      ? "bg-blue-100 border-blue-500"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setSelectedSchema(schema);
                    setFields(schema.fields);
                  }}
                >
                  {schema.name}
                </div>
              ))}
            </div>
          </div>

          {/* Middle Column - Field Editor */}
          <div className="w-1/3 bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">
              {selectedSchema
                ? `Add Fields: ${selectedSchema.name}`
                : "Select a schema"}
            </h2>

            {selectedSchema && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Field Name
                  </label>
                  <input
                    type="text"
                    value={currentField.name}
                    onChange={(e) =>
                      setCurrentField({ ...currentField, name: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Enter field name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={currentField.type}
                    onChange={(e) => {
                      const type = e.target.value as MongooseType;
                      setCurrentField({
                        ...currentField,
                        type,
                        items:
                          type === "Array" || type === "ArrayOfObjects"
                            ? { type: "String" }
                            : undefined,
                        fields: type === "Object" ? [] : undefined,
                      });
                    }}
                    className="w-full p-2 border rounded"
                  >
                    {mongooseTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {currentField.type === "Array" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Array Item Type
                    </label>
                    <select
                      value={currentField.items?.type}
                      onChange={(e) =>
                        setCurrentField({
                          ...currentField,
                          items: { type: e.target.value as BaseMongooseType },
                        })
                      }
                      className="w-full p-2 border rounded"
                    >
                      {["String", "Number", "Boolean", "Date", "ObjectId"].map(
                        (type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}

                {(currentField.type === "Object" ||
                  currentField.type === "ArrayOfObjects") && (
                  <div className="border p-4 rounded">
                    <h3 className="text-lg font-medium mb-2">
                      {currentField.type === "Object"
                        ? "Object Fields"
                        : "Array Item Fields"}
                    </h3>
                    <NestedFieldEditor
                      fields={
                        currentField.type === "Object"
                          ? currentField.fields || []
                          : currentField.items?.fields || []
                      }
                      onFieldsChange={(updatedFields) => {
                        if (currentField.type === "Object") {
                          setCurrentField({
                            ...currentField,
                            fields: updatedFields,
                          });
                        } else {
                          setCurrentField({
                            ...currentField,
                            items: {
                              type: "String",
                              fields: updatedFields,
                            },
                          });
                        }
                      }}
                    />
                  </div>
                )}

                {currentField.type === "ObjectId" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Reference Model
                    </label>
                    <input
                      type="text"
                      value={currentField.ref || ""}
                      onChange={(e) =>
                        setCurrentField({
                          ...currentField,
                          ref: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                      placeholder="Enter model name"
                    />
                  </div>
                )}

                <div className="flex gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Required
                    </label>
                    <input
                      type="checkbox"
                      checked={currentField.required}
                      onChange={(e) =>
                        setCurrentField({
                          ...currentField,
                          required: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Unique
                    </label>
                    <input
                      type="checkbox"
                      checked={currentField.unique}
                      onChange={(e) =>
                        setCurrentField({
                          ...currentField,
                          unique: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Default Value
                  </label>
                  <input
                    type="text"
                    value={currentField.default || ""}
                    onChange={(e) =>
                      setCurrentField({
                        ...currentField,
                        default: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Enter default value (optional)"
                  />
                </div>

                <button
                  onClick={handleAddField}
                  disabled={!currentField.name.trim()}
                  className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Field
                </button>

                {/* Field List */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Current Fields</h3>
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{field.name}</div>
                            <div className="text-sm text-gray-600">
                              Type: {field.type}
                              {field.items && ` (${field.items.type})`}
                              {field.required && ", Required"}
                              {field.unique && ", Unique"}
                              {field.ref && `, Ref: ${field.ref}`}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              const newFields = [...fields];
                              newFields.splice(index, 1);
                              setFields(newFields);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - JSONEditor Preview */}
          <div className="w-5/12 bg-white rounded-lg shadow p-4">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Schema Preview</h2>
              <button
                onClick={handleSaveConfig}
                disabled={!selectedSchema || fields.length === 0}
                className={`p-2 rounded flex items-center gap-1 ${
                  selectedSchema && fields.length > 0
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Save className="w-4 h-4" />
                Save Schema
              </button>
            </div>

            <div ref={jsonEditorRef} className="h-96 border rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemaManagement;
