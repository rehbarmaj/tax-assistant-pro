
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Upload, Trash2, Building } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const settingsSchema = z.object({
  companyName: z.string().min(1, 'Company name is required.'),
  currencySymbol: z.string().min(1, 'Symbol is required.').max(5, 'Symbol must be 5 characters or less.'),
  registrationNumber: z.string().optional(),
  industryType: z.string().optional(),
  companySize: z.string().optional(),
  foundedYear: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Please enter a valid email.').min(1, 'Email is required.'),
  website: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const defaultValues: Partial<SettingsFormValues> = {
  companyName: 'Tax Assistant Pro Inc.',
  email: 'contact@taxassistantpro.com',
  country: 'US',
  website: 'https://taxassistantpro.com',
  currencySymbol: '$',
};

export function SettingsClient() {
  const [logoPreview, setLogoPreview] = useState<string | null>('https://placehold.co/150x150.png');
  const { toast } = useToast();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });

  function onSubmit(data: SettingsFormValues) {
    toast({
        title: "Settings Saved",
        description: "Your company details have been updated successfully.",
    });
    console.log(data);
  }

  const handleLogoUpload = () => {
    // This would trigger a file input in a real app
    alert("Logo upload functionality not implemented.");
  };

  const handleLogoRemove = () => {
    setLogoPreview(null);
  };
  
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 100; year--) {
        years.push(String(year));
    }
    return years;
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
            <Building className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Company Settings</h1>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Company Logo</CardTitle>
                        <CardDescription>Update your company's logo. It will be displayed across the application.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-8">
                            <div className="w-36 h-36 rounded-lg border flex items-center justify-center bg-muted/50">
                                {logoPreview ? (
                                    <Image src={logoPreview} alt="Company Logo Preview" width={150} height={150} className="rounded-lg object-contain" data-ai-hint="company logo"/>
                                ) : (
                                    <span className="text-sm text-muted-foreground">No Logo</span>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button type="button" onClick={handleLogoUpload}>
                                    <Upload className="mr-2 h-4 w-4"/>
                                    Upload Logo
                                </Button>
                                <Button type="button" variant="ghost" className="text-destructive" onClick={handleLogoRemove}>
                                    <Trash2 className="mr-2 h-4 w-4"/>
                                    Remove Logo
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                    <Separator className="my-4"/>
                    <CardHeader>
                        <CardTitle>Company Details</CardTitle>
                        <CardDescription>Manage your company's core information.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name *</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="currencySymbol"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Currency Symbol *</FormLabel>
                              <FormControl><Input placeholder="$" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="registrationNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Registration Number</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="industryType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Industry Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="tech">Technology</SelectItem>
                                    <SelectItem value="finance">Finance</SelectItem>
                                    <SelectItem value="healthcare">Healthcare</SelectItem>
                                    <SelectItem value="retail">Retail</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="companySize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Size</FormLabel>
                               <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="1-10">1-10 employees</SelectItem>
                                    <SelectItem value="11-50">11-50 employees</SelectItem>
                                    <SelectItem value="51-200">51-200 employees</SelectItem>
                                    <SelectItem value="201-500">201-500 employees</SelectItem>
                                    <SelectItem value="500+">500+ employees</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="foundedYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Founded Year</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {generateYearOptions().map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website URL</FormLabel>
                              <FormControl><Input placeholder="https://example.com" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address1"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Address Line 1</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address2"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Address Line 2</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl><Input {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                             <FormField
                              control={form.control}
                              name="state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>State</FormLabel>
                                  <FormControl><Input {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="zip"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>ZIP Code</FormLabel>
                                  <FormControl><Input {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                        </div>
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                               <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="US">United States</SelectItem>
                                    <SelectItem value="CA">Canada</SelectItem>
                                    <SelectItem value="GB">United Kingdom</SelectItem>
                                    <SelectItem value="AU">Australia</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <div className="flex justify-end gap-2 w-full">
                            <Button type="button" variant="outline" onClick={() => form.reset(defaultValues)}>Cancel</Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    </div>
  );
}
