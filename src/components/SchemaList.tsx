import React, { useState } from "react";
import { PlusCircle, Trash2, Edit, X } from "lucide-react";
import { Modal, Button, Title, Input } from "rizzui";
import { Schema } from "types/types";
import { deleteSchemaUrl, updateSchemaUrl } from "./constants";

interface SchemaListProps {
  schemas: Schema[];
  schemaName: string;
  selectedSchema: Schema | null;
  onSchemaNameChange: (name: string) => void;
  onAddSchema: () => void;
  onSelectSchema: (schema: Schema) => void;
  onSchemaUpdate: () => void;
}

const SchemaList: React.FC<SchemaListProps> = ({
  schemas,
  schemaName,
  selectedSchema,
  onSchemaNameChange,
  onAddSchema,
  onSelectSchema,
  onSchemaUpdate,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [schemaToDelete, setSchemaToDelete] = useState<Schema | null>(null);
  const [schemaToUpdate, setSchemaToUpdate] = useState<Schema | null>(null);
  const [updatedName, setUpdatedName] = useState("");

  // Helper function to check if schema is from API (has been saved)
  const isSchemaFromAPI = (schema: Schema) => {
    return schema.hasOwnProperty("_id") || schema.id.toString().length === 24;
  };

  const handleDelete = async () => {
    if (!schemaToDelete) return;

    try {
      const response = await fetch(deleteSchemaUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collectionName: schemaToDelete.name,
        }),
      });

      const data = await response.json();
      if (data.success) {
        onSchemaUpdate();
        setDeleteModalOpen(false);
        setSchemaToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting schema:", error);
    }
  };

  const handleUpdate = async () => {
    if (!schemaToUpdate || !updatedName.trim()) return;

    try {
      const response = await fetch(updateSchemaUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collectionName: schemaToUpdate.name,
          newCollectionName: updatedName,
          schema: {
            fields: schemaToUpdate.fields,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        onSchemaUpdate();
        setUpdateModalOpen(false);
        setSchemaToUpdate(null);
        setUpdatedName("");
      }
    } catch (error) {
      console.error("Error updating schema:", error);
    }
  };

  return (
    <div className="w-3/12 bg-white rounded-lg shadow p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Schemas</h2>
        <div className="flex justify-between gap-2 w-full">
          <Input
            type="text"
            placeholder="New Schema name"
            value={schemaName}
            onChange={(e) => onSchemaNameChange(e.target.value)}
            className="w-full"
          />
          <Button
            variant="solid"
            onClick={onAddSchema}
            disabled={!schemaName.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <PlusCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {schemas.map((schema) => (
          <div
            key={schema.id}
            className={`flex items-center justify-between p-2 rounded cursor-pointer ${
              selectedSchema?.id === schema.id
                ? "bg-blue-50"
                : "hover:bg-gray-50"
            }`}
          >
            <span className="flex-grow" onClick={() => onSelectSchema(schema)}>
              {schema.name}
            </span>
            {isSchemaFromAPI(schema) && (
              <div className="flex gap-2">
                <Button
                  variant="text"
                  size="sm"
                  onClick={() => {
                    setSchemaToUpdate(schema);
                    setUpdatedName(schema.name);
                    setUpdateModalOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4 text-blue-500" />
                </Button>
                <Button
                  variant="text"
                  size="sm"
                  onClick={() => {
                    setSchemaToDelete(schema);
                    setDeleteModalOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div className="max-w-md w-full m-auto bg-white rounded-lg shadow-lg">
          <div className="px-6 pt-4 pb-6">
            <div className="mb-4 flex items-center justify-between">
              <Title as="h3" className="text-gray-900">
                Delete Schema
              </Title>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete the schema "
                {schemaToDelete?.name}"?
              </p>
              <p className="text-red-500 mt-2">This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteModalOpen(false)}
                className="text-gray-700"
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Update Modal */}
      <Modal isOpen={updateModalOpen} onClose={() => setUpdateModalOpen(false)}>
        <div className="max-w-md w-full m-auto bg-white rounded-lg shadow-lg">
          <div className="px-6 pt-4 pb-6">
            <div className="mb-4 flex items-center justify-between">
              <Title as="h3" className="text-gray-900">
                Update Schema Name
              </Title>
              <button
                onClick={() => setUpdateModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mb-6">
              <Input
                type="text"
                placeholder="New schema name"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                className="text-gray-900"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setUpdateModalOpen(false)}
                className="text-gray-700"
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                onClick={handleUpdate}
                disabled={!updatedName.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SchemaList;
