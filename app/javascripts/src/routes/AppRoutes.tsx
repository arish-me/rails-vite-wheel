// src/routes/AppRoutes.jsx
import React from "react";
import { Route, Routes, Navigate } from "react-router";
import PublicLayout from "@/layouts/public-layout";
import PrivateLayout from "@/layouts/private-layout";
import SettingsLayout from "@/pages/settings/layout";
import UserManagementLayout from "@/pages/user-management";
import Roles from "@/pages/user-management/roles";
import Users from "@/pages/user-management/users";
import RolePermissions from "@/pages/user-management/role_permissions";

import Home from "@/pages/home";
import Login from "@/pages/auth/Login";

import { Notifications } from "@/pages/notification";
import Dashboard from "@/pages/dashboard";

import Account from "@/pages/settings/account/page";
import Profile from "@/pages/settings/profile/page";
import Organization from "@/pages/settings/organization_setting/page";

import NotAuthorizedPage from "@/pages/public/403";
import Category from "@/pages/categories/page";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<Login />} />
    </Route>

    <Route path="/" element={<PrivateLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="notification" element={<Notifications />} />
      <Route path="categories" element={<Category />} />
      <Route path="/user-management" element={<UserManagementLayout />}>
        <Route path="roles" element={<Roles />} />
        <Route path="users" element={<Users />} />
        <Route path="role-permissions" element={<RolePermissions />} />
      </Route>
      <Route path="settings" element={<SettingsLayout />}>
        <Route path="account" element={<Account />} />
        <Route path="profile" element={<Profile />} />
        <Route path="organization" element={<Organization />} />
      </Route>
    </Route>

    <Route path="not-authorized" element={<NotAuthorizedPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
