
"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { useI18n } from '@/i18n/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { initialUsers, ALL_MODULES, ALL_PERMISSIONS } from '@/lib/mock-data';
import type { User, UserPermission, AppModule, Permission } from '@/lib/types';
import { Save } from 'lucide-react';

const UserRightsPage: NextPage = () => {
  const t = useI18n();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || '');

  const selectedUser = users.find(u => u.id === selectedUserId);

  const handlePermissionChange = (module: AppModule, right: Permission, checked: boolean) => {
    setUsers(currentUsers =>
      currentUsers.map(user => {
        if (user.id !== selectedUserId) return user;
        
        const newPermissions = [...user.permissions];
        let modulePerms = newPermissions.find(p => p.module === module);

        if (modulePerms) {
          const newRights = new Set(modulePerms.rights);
          if (checked) {
            newRights.add(right);
          } else {
            newRights.delete(right);
          }
          modulePerms.rights = newRights;
        } else {
          newPermissions.push({ module, rights: new Set([right]) });
        }

        return { ...user, permissions: newPermissions };
      })
    );
  };

  const hasPermission = (module: AppModule, right: Permission): boolean => {
    if (!selectedUser) return false;
    const modulePerms = selectedUser.permissions.find(p => p.module === module);
    return modulePerms?.rights.has(right) || false;
  };

  return (
    <div className="container mx-auto">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t('userRights')}</h1>
        <Card>
          <CardHeader>
            <CardTitle>Manage User Permissions</CardTitle>
            <CardDescription>Select a user to view and modify their access rights across different modules.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <label htmlFor="user-select" className="font-medium">User:</label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger id="user-select" className="w-[250px]">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>{user.userId}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    {ALL_PERMISSIONS.map(perm => (
                      <TableHead key={perm} className="text-center capitalize">{perm}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ALL_MODULES.map(moduleInfo => (
                    <TableRow key={moduleInfo.key}>
                      <TableCell className="font-medium">{moduleInfo.name}</TableCell>
                      {ALL_PERMISSIONS.map(perm => (
                        <TableCell key={perm} className="text-center">
                          <Checkbox
                            checked={hasPermission(moduleInfo.key, perm)}
                            onCheckedChange={(checked) => handlePermissionChange(moduleInfo.key, perm, !!checked)}
                            disabled={selectedUser?.userId === 'ADMIN'}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
                <Button>
                    <Save className="mr-2" /> Save Changes for {selectedUser?.userId}
                </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserRightsPage;
