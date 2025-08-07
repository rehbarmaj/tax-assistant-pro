
"use client";

import { useState } from 'react';
import type { NextPage } from 'next';
import { useI18n } from '@/i18n/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Building, User, Key, Globe, Save } from 'lucide-react';

interface CompanyInfo {
    name: string;
    ntn: string;
    strn: string;
    address: string;
}

interface AdminInfo {
    loginId: string;
    email: string;
}

const SettingsPage: NextPage = () => {
  const t = useI18n();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: 'Tax Assistant Pro Inc.',
    ntn: '1234567-8',
    strn: '9876543210',
    address: '123 Finance Street, Business City',
  });
  const [adminInfo, setAdminInfo] = useState<AdminInfo>({
    loginId: 'admin',
    email: 'admin@example.com',
  });

  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyInfo({ ...companyInfo, [e.target.name]: e.target.value });
  };
  
  const handleAdminInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminInfo({ ...adminInfo, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = (section: string) => {
    // In a real app, you would save this data to a backend.
    console.log(`Saving ${section}:`, section === 'company' ? companyInfo : adminInfo);
    toast({
      title: 'Settings Saved',
      description: `Your ${section} information has been updated.`,
    });
  };

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{t('settings')}</h1>
      
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="company">
            <Building className="mr-2" />
            Company Information
          </TabsTrigger>
          <TabsTrigger value="admin">
            <User className="mr-2" />
            Admin Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
              <CardDescription>Update your company's profile and tax information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input id="name" name="name" value={companyInfo.name} onChange={handleCompanyInfoChange} />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ntn">NTN (National Tax Number)</Label>
                  <Input id="ntn" name="ntn" value={companyInfo.ntn} onChange={handleCompanyInfoChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="strn">STRN (Sales Tax Registration Number)</Label>
                  <Input id="strn" name="strn" value={companyInfo.strn} onChange={handleCompanyInfoChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={companyInfo.address} onChange={handleCompanyInfoChange} />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSaveChanges('company')}>
                  <Save className="mr-2" />
                  Save Company Info
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="admin">
          <Card>
            <CardHeader>
              <CardTitle>Administrator Settings</CardTitle>
              <CardDescription>Manage administrator credentials and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                <Label htmlFor="loginId">Login ID</Label>
                <Input id="loginId" name="loginId" value={adminInfo.loginId} onChange={handleAdminInfoChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={adminInfo.email} onChange={handleAdminInfoChange} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" name="newPassword" type="password" placeholder="Leave blank to keep current password" />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSaveChanges('admin')}>
                  <Save className="mr-2" />
                  Save Admin Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
