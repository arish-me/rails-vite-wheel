import React, { useEffect, useState } from 'react';
import { fetch, update, create } from '@/apis/rolePermissionsApi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader } from "@/components/common/loader"
import { useNavigate } from 'react-router-dom';

const RolesList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const { data } = await fetch();
        setRoles(data);
      } catch (error) {
        if (error.status === 403) {
          navigate('/not-authorized'); // Redirect to 403 page
          return; // Stop further execution
        }
        toast.error('Failed to load roles');
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, []);

  const handleActionChange = async (permissionId, roleId, resource, action) => {
    try {
      const payload = { resource, role_id: roleId, action };
      const response = permissionId ? await update(roleId, payload) : await create(payload);
      const notice = response?.data?.notice || 'Action successful';
      toast.success(notice);
    } catch (err) {
      const error = err?.response?.data?.error || 'An error occurred';
      toast.error(error);
    }
  };

  if (loading) {
    return <Loader/>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Roles and Permissions</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <div key={role.id} className="p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-lg font-bold mb-4">{role.role_name}</h2>
            <Dialog>
              <DialogTrigger asChild>
                    <Button onClick={() => setSelectedRoleId(role.id)}>
                      Manage Permissions
                    </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manage Resources for {role.role_name}</DialogTitle>
                  <DialogDescription>
                    Select the actions for each resource applicable for the role.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-col space-y-4">
                  {role.permissions.map((permission) => (
                    <div key={permission.resource} className="flex items-center justify-between">
                      <span className="font-medium">{permission.resource}</span>
                      <select
                        className="ml-4 p-2 border rounded"
                        defaultValue={permission.action}
                        onChange={(e) => handleActionChange(permission?.id, role.id, permission.resource, e.target.value)}
                      >
                        <option value="view">View</option>
                        <option value="edit">Edit</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolesList;