// Categories.tsx
import { useEffect, useState, useMemo } from 'react';
import { fetch, bulkDelete } from '@/apis/rolesApi';
import { DataTable } from "@/components/data-table/data-table"
import { createColumns } from "@/components/data-table/column-def"
import { RoleSheet } from "./role-sheet"
import { toast } from "sonner";
import { Loader } from "@/components/common/loader"
import { useNavigate } from 'react-router-dom';

type Role = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export default function Roles() {
  const [resources, setResources] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentResource, setCurrentResource] = useState<Role | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();

  const selectedRows = useMemo(
    () => resources.filter((_, index) => rowSelection[index]),
    [rowSelection, resources]
  );

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch();
      setResources(response.data.roles);
    } catch (error) {
     if (error.status === 403) {
        navigate('/not-authorized'); // Redirect to 403 page
        return; // Stop further execution
      }
      setError('Error fetching roles');
    } finally {
      setLoading(false);
    }
  };

  const handleNewResource = () => {
    setCurrentResource(null);
    setIsEditing(true);
  };

  const handleEditResource = (resource: Role) => {
    setCurrentResource(resource);
    setIsEditing(true);
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length > 0) {
      try {
        const response = await bulkDelete({ ids: selectedRows.map(resource => resource.id) });
        await fetchResources();
        const { notice } = response.data;
        toast.success(notice);
        setRowSelection({});
      } catch (err) {
        const error = err?.response?.data?.error || 'An error occurred';
        toast.error(error);
      } finally {
        setRowSelection({});
        setDialogOpen(false);
      }
    } else {
      toast.error("No rows selected for deletion.");
    }
  };

  const handleSaveResource = (newResource: Role) => {
    fetchResources();
    setIsEditing(false);
  };

  const columns = createColumns<Role>([
    {
      key: "index",
      header: "ID",
      enableSelection: true,
      renderCell: (_value, _row, index) => index + 1,
    },
    {
      key: "name",
      header: "Name",
    },
    {
      key: "created_at",
      header: "Created At",
      renderCell: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "updated_at",
      header: "Updated At",
      renderCell: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "actions",
      dropdownItems: [
        { label: "Edit", onClick: (row) => handleEditResource(row) },
      ],
    },
  ]);

  return (
    <div className="container mx-auto py-10">
      {loading ? (
        <Loader/>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <DataTable<Category>
          data={resources}
          columns={columns}
          modelName="Role"
          filterPlaceholder="Search Roles..."
          filterColumns={[
            { name: "name", type: "text" },
          ]}
          selectedRows={selectedRows}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onDelete={handleBulkDelete}
          onNewItem={handleNewResource}
          isDialogOpen={isDialogOpen}
          setDialogOpen={setDialogOpen}
        />
      )}
      <RoleSheet
        open={isEditing}
        modelName="Role"
        onOpenChange={setIsEditing}
        resource={currentResource}
        onSave={handleSaveResource}
      />
    </div>
  );
}
