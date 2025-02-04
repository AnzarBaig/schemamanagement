import { Plus, X } from "lucide-react";
import { useState } from "react";
import {
  BaseMongooseType,
  NestedFieldEditorProps,
  ObjectField,
} from "types/types";

// Nested Field Editor Component
const NestedFieldEditor: React.FC<NestedFieldEditorProps> = ({
  fields,
  onFieldsChange,
}) => {
  const [newField, setNewField] = useState<ObjectField>({
    name: "",
    type: "string",
    required: false,
    unique: false,
  });

  const handleAddField = () => {
    if (newField.name.trim()) {
      onFieldsChange([...fields, { ...newField }]);
      setNewField({
        name: "",
        type: "string",
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
          {["string", "number", "boolean", "date", "objectId"].map((type) => (
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
      {/* 
      {newField.type === "objectId" && (
        <input
          type="text"
          value={newField.ref || ""}
          onChange={(e) => setNewField({ ...newField, ref: e.target.value })}
          placeholder="Reference Model"
          className="w-full p-2 border rounded"
        />
      )} */}

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

export default NestedFieldEditor;
