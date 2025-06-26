
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { User, UserPermission, AppModule, Permission } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Search, ShieldCheck, Save, Trash2, XCircle, AlertCircle } from 'lucide-react';
import { initialUsers, ALL_MODULES, ALL_PERMISSIONS } from '@/lib/mock-data';

// --- Zod Schema for Validation ---
const userFormSchema = z.object({
  userId: z.string().min(1, 'User ID is required.').max(10, 'User ID must be 10 characters or less.'),
  login: z.string().min(1, 'Login is required.').max(10, 'Login must be 10 characters or less.'),
  password: z.string().min(1, 'Password is required.').max(10, 'Password must be 10 characters or less.'),
  permissions: z.record(z.set(z.string()))
});

type UserFormValues = z.infer<typeof userFormSchema>;


export function UserRightsClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      userId: '',
      login: '',
      password: '',
      permissions: {},
    },
  });

  useEffect(() => {
    // Simulate API call
    setUsers(initialUsers);
  }, []);
  
  useEffect(() => {
    if (selectedUser) {
      const perms = ALL_MODULES.reduce((acc, module) => {
        const userPerm = selectedUser.permissions.find(p => p.module === module.key);
        acc[module.key] = userPerm ? userPerm.rights : new Set<Permission>();
        return acc;
      }, {} as Record<AppModule, Set<Permission>>);

      form.reset({
        userId: selectedUser.userId,
        login: selectedUser.login,
        password: '', // Password field is for changing/setting, not displaying
        permissions: perms,
      });
      setIsNewUser(false);
    } else {
        handleAddNewUser();
    }
  }, [selectedUser, form]);

  const handleAddNewUser = () => {
    setSelectedUser(null);
    form.reset({
        userId: '',
        login: '',
        password: '',
        permissions: ALL_MODULES.reduce((acc, module) => {
          acc[module.key] = new Set<Permission>();
          return acc;
        }, {} as Record<AppModule, Set<Permission>>),
    });
    setIsNewUser(true);
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setIsNewUser(false);
  };

  const handlePermissionChange = (module: AppModule, right: Permission, checked: boolean) => {
    const currentPermissions = form.getValues('permissions');
    const newRights = new Set(currentPermissions[module]);
    if (checked) {
      newRights.add(right);
      if (right !== 'view') newRights.add('view'); // Auto-add view permission
    } else {
      newRights.delete(right);
      if (right === 'view') { // If view is removed, remove all other rights
        newRights.clear();
      }
    }
    form.setValue(`permissions.${module}`, newRights, { shouldValidate: true, shouldDirty: true });
  };
  
  const filteredUsers = useMemo(() => users.filter(user =>
    user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.login.toLowerCase().includes(searchTerm.toLowerCase())
  ), [users, searchTerm]);

  function onSubmit(data: UserFormValues) {
    // In a real app, you'd send this to your backend API
    const permissions: UserPermission[] = Object.entries(data.permissions)
      .map(([module, rights]) => ({ module: module as AppModule, rights: rights as Set<Permission> }))
      .filter(p => p.rights.size > 0);

    if (isNewUser) {
      const newUser: User = {
        id: String(Date.now()),
        userId: data.userId,
        login: data.login,
        passwordHash: `hashed_${data.password}`, // Mock hashing
        permissions,
      };
      setUsers(prev => [...prev, newUser]);
      handleSelectUser(newUser);
      alert(`User ${newUser.login} created successfully!`);
    } else if (selectedUser) {
      const updatedUser: User = {
        ...selectedUser,
        userId: data.userId,
        login: data.login,
        // Only update password if a new one was provided
        passwordHash: data.password ? `hashed_${data.password}` : selectedUser.passwordHash,
        permissions,
      };
      setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
      setSelectedUser(updatedUser); // Reselect to show updated data
      alert(`User ${updatedUser.login} updated successfully!`);
    }
  }
  
  const handleDeleteUser = () => {
      if (selectedUser) {
          if (confirm(`Are you sure you want to delete user ${selectedUser.login}?`)) {
              setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
              setSelectedUser(null);
              handleAddNewUser();
          }
      }
  }


  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Left Column - User List */}
      <div className="md:col-span-1">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <div className="relative pt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
          </CardHeader>
          <CardContent>
             <Button onClick={handleAddNewUser} className="w-full mb-4">
                <PlusCircle className="mr-2 h-5 w-5" /> New User
            </Button>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <div className="space-y-2">
                {filteredUsers.map(user => (
                  <Button
                    key={user.id}
                    variant={selectedUser?.id === user.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => handleSelectUser(user)}
                  >
                    {user.userId} ({user.login})
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Form */}
      <div className="md:col-span-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-8 w-8 text-primary" />
                            <CardTitle className="text-3xl font-bold text-primary">
                            {isNewUser ? 'Create New User' : `Edit User: ${selectedUser?.userId}`}
                            </CardTitle>
                        </div>
                        <CardDescription>
                            {isNewUser ? 'Define the new user and their permissions.' : 'Update user details and permissions.'}
                        </CardDescription>
                    </div>
                     <div className="flex gap-2">
                        <Button type="submit" disabled={form.formState.isSubmitting}><Save className="mr-2 h-4 w-4"/>Save</Button>
                        <Button type="button" variant="destructive" onClick={handleDeleteUser} disabled={!selectedUser || isNewUser}><Trash2 className="mr-2 h-4 w-4"/>Delete</Button>
                        <Button type="button" variant="outline" onClick={() => form.reset()}><XCircle className="mr-2 h-4 w-4"/>Cancel</Button>
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Constraint Notice</AlertTitle>
                  <AlertDescription>
                    All text fields are limited to a maximum of 10 characters.
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                   <FormField
                      control={form.control}
                      name="userId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User ID *</FormLabel>
                          <FormControl><Input placeholder="e.g. EMP001" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="login"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Login *</FormLabel>
                          <FormControl><Input placeholder="e.g. john.doe" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isNewUser ? 'Password *' : 'New Password'}</FormLabel>
                          <FormControl><Input type="password" placeholder="Min. 1 character" {...field} /></FormControl>
                           <CardDescription>{isNewUser ? '' : 'Leave blank to keep current password.'}</CardDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                
                <Label className="text-lg font-semibold">User Rights</Label>
                 <ScrollArea className="h-[calc(100vh-450px)] mt-2 border rounded-md">
                    <Table>
                        <TableHeader className="sticky top-0 bg-muted">
                            <TableRow>
                                <TableHead className="w-[200px]">Module</TableHead>
                                {ALL_PERMISSIONS.map(p => <TableHead key={p} className="text-center capitalize">{p}</TableHead>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ALL_MODULES.map(module => (
                                <TableRow key={module.key}>
                                    <TableCell className="font-medium">{module.name}</TableCell>
                                    {ALL_PERMISSIONS.map(right => (
                                        <TableCell key={right} className="text-center">
                                            <Checkbox
                                                checked={form.watch(`permissions.${module.key}`)?.has(right)}
                                                onCheckedChange={(checked) => handlePermissionChange(module.key, right, !!checked)}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
