
"use client";

import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Search, FileDown, ChevronsUpDown, Pencil, Trash2 } from 'lucide-react';
import type { Product } from '@/lib/types';
import { initialProducts, mockTaxRates } from '@/lib/mock-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { PrintButton } from '@/components/ui/print-button';

const productSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, 'Product code is required.'),
  name: z.string().min(1, 'Product name is required.'),
  hsnSac: z.string().min(1, 'HSN/SAC code is required.'),
  unit: z.string().min(1, 'Unit is required.'),
  salePrice: z.coerce.number().min(0, 'Sale price must be a positive number.'),
  taxRateId: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductsPage: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      code: '',
      name: '',
      hsnSac: '',
      unit: '',
      salePrice: 0,
      taxRateId: '',
    },
  });

  useEffect(() => {
    if (editingProduct) {
      form.reset(editingProduct);
    } else {
      form.reset({
        id: '',
        code: '',
        name: '',
        hsnSac: '',
        unit: '',
        salePrice: 0,
        taxRateId: '',
      });
    }
  }, [editingProduct, form]);

  const onSubmit = (data: ProductFormValues) => {
    if (editingProduct) {
      // Update existing product
      const updatedProduct = { ...editingProduct, ...data };
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
      toast({ title: 'Success', description: 'Product has been updated.' });
    } else {
      // Add new product
      const newProduct: Product = {
        id: `P${Math.random().toString(36).substr(2, 9)}`,
        purchasePrice: 0, // Assuming default purchase price, can be adjusted
        ...data,
      };
      setProducts(prev => [...prev, newProduct]);
      toast({ title: 'Success', description: 'New product has been added.' });
    }
    
    setIsDialogOpen(false);
    setEditingProduct(null);
  };
  
  const handleAddNew = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };
  
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };
  
  const getTaxRateById = (id?: string) => {
    return mockTaxRates.find(rate => rate.id === id)?.name || 'N/A';
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.hsnSac.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2" /> Add Product
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>
               <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Code</FormLabel>
                          <FormControl><Input placeholder="e.g., P004" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl><Input placeholder="e.g., Wireless Mouse" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                      control={form.control}
                      name="hsnSac"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HSN/SAC</FormLabel>
                          <FormControl><Input placeholder="e.g., 847160" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <FormControl><Input placeholder="e.g., pcs" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <FormField
                      control={form.control}
                      name="salePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sale Price</FormLabel>
                          <FormControl><Input type="number" placeholder="e.g., 25" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="taxRateId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax Rate</FormLabel>
                           <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a tax rate" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockTaxRates.map(rate => (
                                <SelectItem key={rate.id} value={rate.id}>
                                  {rate.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save Product</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by Code, Name, HSN/SAC"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <PrintButton />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                    <FileDown className="mr-2" /> Export
                    <ChevronsUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                    <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div id="print-content" className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>HSN/SAC</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Tax Rate</TableHead>
                <TableHead className="text-right">Sale Price</TableHead>
                <TableHead className="text-right print-hidden">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.code}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.hsnSac}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>{getTaxRateById(product.taxRateId)}</TableCell>
                  <TableCell className="text-right">{product.salePrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right print-hidden">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
