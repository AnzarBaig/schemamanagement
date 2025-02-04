import React, { useRef, useEffect } from "react";
import { Save, RefreshCw } from "lucide-react";
import JSONEditor from "jsoneditor";
import { Schema, Field } from "types/types";
import { generateSchemaJSON } from "components/schemaGenerator";
import { updateSchemaUrl } from "components/constants";
import "jsoneditor/dist/jsoneditor.css";
import toast from "react-hot-toast";

interface SchemaPreviewProps {
  selectedSchema: Schema | null;
  fields: Field[];
  onSave: (schemaConfig: any) => void;
}

const SchemaPreview: React.FC<SchemaPreviewProps> = ({
  selectedSchema,
  fields,
  onSave,
}) => {
  const jsonEditorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<JSONEditor | null>(null);

  // Helper function to check if schema is from API
  const isSchemaFromAPI = (schema: Schema | null) => {
    return schema?.hasOwnProperty("_id") || schema?.id.toString().length === 24;
  };

  // Initialize JSONEditor
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
        options as any
      );

      if (selectedSchema) {
        const schemaJSON = generateSchemaJSON(selectedSchema, fields);
        editorInstanceRef.current.set(schemaJSON);
      }
    }

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (editorInstanceRef.current && selectedSchema) {
      const schemaJSON = generateSchemaJSON(selectedSchema, fields);
      editorInstanceRef.current.set(schemaJSON);
    }
  }, [fields, selectedSchema]);

  const handleSaveClick = () => {
    if (!editorInstanceRef.current) {
      console.error("Editor not initialized");
      return;
    }

    try {
      const schemaConfig = editorInstanceRef.current.get();
      onSave(schemaConfig);
    } catch (error) {
      console.error("Error getting schema config:", error);
    }
  };

  const handleUpdateClick = async () => {
    if (!editorInstanceRef.current || !selectedSchema) {
      console.error("Editor not initialized or no schema selected");
      return;
    }

    try {
      const schemaConfig = editorInstanceRef.current.get();
      const response = await fetch(updateSchemaUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collectionName: selectedSchema.name,
          schema: {
            fields: schemaConfig.schema.fields,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("Schema updated successfully");
        toast.success("Schema updated successfully");
        // window.location.reload();
      } else {
        console.error("Failed to update schema:", data.error);
        toast.error("Failed to update schema");
      }
    } catch (error) {
      console.error("Error updating schema:", error);
      toast.error("Failed to update schema");
    }
  };

  return (
    <div className="w-5/12 bg-white rounded-lg shadow p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Schema Preview</h2>
        {isSchemaFromAPI(selectedSchema) ? (
          <button
            onClick={handleUpdateClick}
            disabled={!selectedSchema || fields.length === 0}
            className={`p-2 rounded flex items-center gap-1 ${
              selectedSchema && fields.length > 0
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            Update Schema
          </button>
        ) : (
          <button
            onClick={handleSaveClick}
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
        )}
      </div>
      <div ref={jsonEditorRef} className="h-96 border rounded" />
    </div>
  );
};

export default SchemaPreview;
