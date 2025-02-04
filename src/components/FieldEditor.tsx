// // FieldEditor.tsx
// import React from "react";
// import { Plus, X } from "lucide-react";
// import { Field, MongooseType, Schema } from "types/types";
// import NestedFieldEditor from "components/NestedFieldEditor";

// interface FieldEditorProps {
//   selectedSchema: Schema | null;
//   currentField: Field;
//   fields: Field[];
//   onCurrentFieldChange: (field: Field) => void;
//   onAddField: () => void;
//   onRemoveField: (index: number) => void;
//   onFieldsChange: (fields: Field[]) => void;
// }

// const FieldEditor: React.FC<FieldEditorProps> = ({
//   selectedSchema,
//   currentField,
//   fields,
//   onCurrentFieldChange,
//   onAddField,
//   onRemoveField,
//   onFieldsChange,
// }) => {
//   const mongooseTypes: MongooseType[] = [
//     "string",
//     "number",
//     "boolean",
//     "date",
//     "ref",
//     "arrayOfRef",
//     "array",
//     "object",
//     "arrayOfString",
//     "arrayOfObjects",
//   ];

//   return (
//     <div className="w-1/3 bg-white rounded-lg shadow p-4">
//       <h2 className="text-xl font-semibold mb-4">
//         {selectedSchema
//           ? `Add Fields: ${selectedSchema.name}`
//           : "Select a schema"}
//       </h2>

//       {selectedSchema && (
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Field Name</label>
//             <input
//               type="text"
//               value={currentField.name}
//               onChange={(e) =>
//                 onCurrentFieldChange({ ...currentField, name: e.target.value })
//               }
//               className="w-full p-2 border rounded"
//               placeholder="Enter field name"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Type</label>
//             <select
//               value={currentField.type}
//               onChange={(e) => {
//                 const type = e.target.value as MongooseType;
//                 onCurrentFieldChange({
//                   ...currentField,
//                   type,
//                   items:
//                     type === "array" || type === "arrayOfObjects"
//                       ? { type: "string" }
//                       : undefined,
//                   fields: type === "object" ? [] : undefined,
//                 });
//               }}
//               className="w-full p-2 border rounded"
//             >
//               {mongooseTypes.map((type) => (
//                 <option key={type} value={type}>
//                   {type}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Nested Fields Editor */}
//           {(currentField.type === "object" ||
//             currentField.type === "arrayOfObjects") && (
//             <div className="border p-4 rounded">
//               <h3 className="text-lg font-medium mb-2">
//                 {currentField.type === "object"
//                   ? "Object Fields"
//                   : "Array Item Fields"}
//               </h3>
//               <NestedFieldEditor
//                 fields={currentField.fields || []}
//                 onFieldsChange={(updatedFields) => {
//                   onCurrentFieldChange({
//                     ...currentField,
//                     fields: updatedFields,
//                   });
//                 }}
//               />
//             </div>
//           )}

//           {/* Field Options */}
//           <div className="flex gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Required</label>
//               <input
//                 type="checkbox"
//                 checked={currentField.required}
//                 onChange={(e) =>
//                   onCurrentFieldChange({
//                     ...currentField,
//                     required: e.target.checked,
//                   })
//                 }
//                 className="rounded"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Unique</label>
//               <input
//                 type="checkbox"
//                 checked={currentField.unique}
//                 onChange={(e) =>
//                   onCurrentFieldChange({
//                     ...currentField,
//                     unique: e.target.checked,
//                   })
//                 }
//                 className="rounded"
//               />
//             </div>
//           </div>

//           {/* Additional Fields */}
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Default Value
//             </label>
//             <input
//               type="text"
//               value={currentField.default || ""}
//               onChange={(e) =>
//                 onCurrentFieldChange({
//                   ...currentField,
//                   default: e.target.value,
//                 })
//               }
//               className="w-full p-2 border rounded"
//               placeholder="Enter default value (optional)"
//             />
//           </div>

//           {(currentField.type === "ref" ||
//             currentField.type === "arrayOfRef") && (
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Reference Model
//               </label>
//               <input
//                 type="text"
//                 value={currentField.ref || ""}
//                 onChange={(e) =>
//                   onCurrentFieldChange({
//                     ...currentField,
//                     ref: e.target.value,
//                   })
//                 }
//                 className="w-full p-2 border rounded"
//                 placeholder="Enter model name"
//               />
//             </div>
//           )}

//           {/* Add Field Button */}
//           <button
//             onClick={onAddField}
//             disabled={!currentField.name.trim()}
//             className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-1"
//           >
//             <Plus className="w-4 h-4" />
//             Add Field
//           </button>

//           {/* Field List */}
//           <div className="mt-6">
//             <h3 className="text-lg font-medium mb-2">Current Fields</h3>
//             <div className="space-y-2">
//               {fields.map((field, index) => (
//                 <div key={index} className="p-3 bg-gray-50 rounded">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <div className="font-medium">{field.name}</div>
//                       <div className="text-sm text-gray-600">
//                         Type: {field.type}
//                         {field.items && ` (${field.items.type})`}
//                         {field.required && ", Required"}
//                         {field.unique && ", Unique"}
//                         {field.ref && `, Ref: ${field.ref}`}
//                         {field.default && `, Default: ${field.default}`}
//                       </div>
//                       {(field.type === "object" ||
//                         field.type === "arrayOfObjects") &&
//                         field.fields && (
//                           <div className="mt-2 pl-4 border-l-2 border-gray-200">
//                             <div className="text-sm font-medium">
//                               Nested Fields:
//                             </div>
//                             {field.fields.map((nestedField, nIdx) => (
//                               <div key={nIdx} className="text-sm text-gray-600">
//                                 {nestedField.name}: {nestedField.type}
//                                 {nestedField.required && " (Required)"}
//                                 {nestedField.unique && " (Unique)"}
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                     </div>
//                     <button
//                       onClick={() => onRemoveField(index)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FieldEditor;
import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Field, MongooseType, Schema } from "types/types";
import NestedFieldEditor from "components/NestedFieldEditor";
import { getSchemaUrl } from "components/constants";
import { MultiSelect } from "react-multi-select-component";

interface FieldEditorProps {
  selectedSchema: Schema | null;
  currentField: Field;
  fields: Field[];
  onCurrentFieldChange: (field: Field) => void;
  onAddField: () => void;
  onRemoveField: (index: number) => void;
  onFieldsChange: (fields: Field[]) => void;
}

interface Option {
  label: string;
  value: string;
}

const FieldEditor: React.FC<FieldEditorProps> = ({
  selectedSchema,
  currentField,
  fields,
  onCurrentFieldChange,
  onAddField,
  onRemoveField,
  onFieldsChange,
}) => {
  const [availableSchemas, setAvailableSchemas] = useState<Schema[]>([]);
  const [selectedRefs, setSelectedRefs] = useState<Option[]>([]);

  const mongooseTypes: MongooseType[] = [
    "string",
    "number",
    "boolean",
    "date",
    "ref",
    "arrayOfRef",
    "array",
    "object",
    "arrayOfString",
    "arrayOfObjects",
  ];

  useEffect(() => {
    fetchAvailableSchemas();
  }, []);

  useEffect(() => {
    // Update selectedRefs when currentField.ref changes for arrayOfRef
    if (currentField.type === "arrayOfRef" && Array.isArray(currentField.ref)) {
      const newSelectedRefs = currentField.ref.map((ref) => ({
        label: ref,
        value: ref,
      }));
      setSelectedRefs(newSelectedRefs);
    } else {
      setSelectedRefs([]);
    }
  }, [currentField.ref, currentField.type]);

  const fetchAvailableSchemas = async () => {
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
        setAvailableSchemas(
          data.schemas.map((schema: any) => ({
            id: schema._id,
            name: schema.collectionName,
            fields: [],
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching schemas:", error);
    }
  };

  const schemaOptions: Option[] = availableSchemas.map((schema) => ({
    label: schema.name,
    value: schema.name,
  }));

  return (
    <div className="w-1/3 bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">
        {selectedSchema
          ? `Add Fields: ${selectedSchema.name}`
          : "Select a schema"}
      </h2>

      {selectedSchema && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Field Name</label>
            <input
              type="text"
              value={currentField.name}
              onChange={(e) =>
                onCurrentFieldChange({ ...currentField, name: e.target.value })
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
                onCurrentFieldChange({
                  ...currentField,
                  type,
                  items:
                    type === "array" || type === "arrayOfObjects"
                      ? { type: "string" }
                      : undefined,
                  fields: type === "object" ? [] : undefined,
                  ref: type === "arrayOfRef" ? [] : undefined,
                });
                setSelectedRefs([]);
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

          {/* Reference Model Selection for single ref */}
          {currentField.type === "ref" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Reference Model
              </label>
              <select
                value={currentField.ref || ""}
                onChange={(e) =>
                  onCurrentFieldChange({
                    ...currentField,
                    ref: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              >
                <option value="">Select a model</option>
                {availableSchemas.map((schema) => (
                  <option key={schema.id} value={schema.name}>
                    {schema.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Multiple Reference Model Selection using MultiSelect */}
          {currentField.type === "arrayOfRef" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Reference Models (Multiple)
              </label>
              <MultiSelect
                options={schemaOptions}
                value={selectedRefs}
                onChange={(selected: Option[]) => {
                  setSelectedRefs(selected);
                  onCurrentFieldChange({
                    ...currentField,
                    ref: selected.map((option) => option.value),
                  });
                }}
                labelledBy="Select reference models"
                className="w-full"
              />
            </div>
          )}

          {/* Nested Fields Editor */}
          {(currentField.type === "object" ||
            currentField.type === "arrayOfObjects") && (
            <div className="border p-4 rounded">
              <h3 className="text-lg font-medium mb-2">
                {currentField.type === "object"
                  ? "Object Fields"
                  : "Array Item Fields"}
              </h3>
              <NestedFieldEditor
                fields={currentField.fields || []}
                onFieldsChange={(updatedFields) => {
                  onCurrentFieldChange({
                    ...currentField,
                    fields: updatedFields,
                  });
                }}
              />
            </div>
          )}

          {/* Field Options */}
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Required</label>
              <input
                type="checkbox"
                checked={currentField.required}
                onChange={(e) =>
                  onCurrentFieldChange({
                    ...currentField,
                    required: e.target.checked,
                  })
                }
                className="rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unique</label>
              <input
                type="checkbox"
                checked={currentField.unique}
                onChange={(e) =>
                  onCurrentFieldChange({
                    ...currentField,
                    unique: e.target.checked,
                  })
                }
                className="rounded"
              />
            </div>
          </div>

          {/* Default Value */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Default Value
            </label>
            <input
              type="text"
              value={currentField.default || ""}
              onChange={(e) =>
                onCurrentFieldChange({
                  ...currentField,
                  default: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              placeholder="Enter default value (optional)"
            />
          </div>

          {/* Add Field Button */}
          <button
            onClick={onAddField}
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
                        {field.type === "ref" &&
                          field.ref &&
                          `, Ref: ${field.ref}`}
                        {field.type === "arrayOfRef" &&
                          Array.isArray(field.ref) &&
                          `, Refs: ${field.ref.join(", ")}`}
                        {field.default && `, Default: ${field.default}`}
                      </div>
                      {(field.type === "object" ||
                        field.type === "arrayOfObjects") &&
                        field.fields && (
                          <div className="mt-2 pl-4 border-l-2 border-gray-200">
                            <div className="text-sm font-medium">
                              Nested Fields:
                            </div>
                            {field.fields.map((nestedField, nIdx) => (
                              <div key={nIdx} className="text-sm text-gray-600">
                                {nestedField.name}: {nestedField.type}
                                {nestedField.required && " (Required)"}
                                {nestedField.unique && " (Unique)"}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                    <button
                      onClick={() => onRemoveField(index)}
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
  );
};

export default FieldEditor;
