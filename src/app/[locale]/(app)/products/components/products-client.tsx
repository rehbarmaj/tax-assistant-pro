
"use client";

import { useState, useEffect } from 'react';
import type { Product, TaxRate } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Edit, Trash2, Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from '@/components/ui/card';
import { initialProducts, mockTaxRates } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/currency';

export function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const currencySymbol = '$'; // Simulate fetching setting

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(initialProducts);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    // In a real app, also delete selected product if it's in selectedProducts
    setSelectedProducts(prev => {
      const updated = new Set(prev);
      updated.delete(id);
      return updated;
    });
  };

  const handleSaveProduct = (productData: Omit<Product, 'id'> & { id?: string }) => {
    if (editingProduct && productData.id) {
      setProducts(products.map(p => (p.id === productData.id ? { ...p, ...productData } : p)));
    } else {
      setProducts([...products, { ...productData, id: String(Date.now()) } as Product]);
    }
    setIsDialogOpen(false);
    setEditingProduct(null);
  };
  
  const handleSelectProduct = (productId: string, checked: boolean) => {
    setSelectedProducts(prev => {
      const updated = new Set(prev);
      if (checked) {
        updated.add(productId);
      } else {
        updated.delete(productId);
      }
      return updated;
    });
  };

  const handleSelectAllProducts = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTaxRateName = (taxRateId?: string) => {
    if (!taxRateId) return 'N/A';
    return mockTaxRates.find(r => r.id === taxRateId)?.name || 'Unknown';
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-primary">Product Management</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddProduct} variant="default" className="shadow-md hover:shadow-lg">
            <PlusCircle className="mr-2 h-5 w-5" /> Add Product
          </Button>
        </div>
      </div>

      <div className="mb-6 p-4 border rounded-lg shadow-sm bg-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto justify-start">
                <Filter className="mr-2 h-4 w-4" /> Filter by Tax Rate
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Tax Rates</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {mockTaxRates.map(rate => (
                <DropdownMenuItem key={rate.id} onSelect={() => alert(`Filtering by ${rate.name} (not implemented)`)}>
                  {rate.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {selectedProducts.size > 0 && (
            <Button variant="destructive" onClick={() => alert('Bulk delete not implemented')}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete Selected ({selectedProducts.size})
            </Button>
          )}
        </div>
      </div>

      <Card className="shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                 <Checkbox 
                    checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                    onCheckedChange={(checked) => handleSelectAllProducts(Boolean(checked))}
                    aria-label="Select all products"
                  />
              </TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="text-right">Purchase Price</TableHead>
              <TableHead className="text-right">Sale Price</TableHead>
              <TableHead>HSN/SAC</TableHead>
              <TableHead>Tax Rate</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-5" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <TableRow key={product.id} data-state={selectedProducts.has(product.id) ? "selected" : ""}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedProducts.has(product.id)}
                      onCheckedChange={(checked) => handleSelectProduct(product.id, Boolean(checked))}
                      aria-label={`Select product ${product.name}`}
                    />
                  </TableCell>
                  <TableCell>{product.code}</TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell className="text-right">{formatCurrency(product.purchasePrice, currencySymbol)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(product.salePrice, currencySymbol)}</TableCell>
                  <TableCell>{product.hsnSac}</TableCell>
                  <TableCell>{getTaxRateName(product.taxRateId)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)} className="hover:text-primary">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)} className="hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center h-24">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <ProductDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        taxRates={mockTaxRates}
      />
    </div>
  );
}

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'> & { id?: string }) => void;
  product: Product | null;
  taxRates: TaxRate[];
}

function ProductDialog({ isOpen, onClose, onSave, product, taxRates }: ProductDialogProps) {
  const [formData, setFormData] = useState<Partial<Product>>({});

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        code: '', name: '', unit: '', purchasePrice: 0, salePrice: 0, hsnSac: '', taxRateId: taxRates.length > 0 ? taxRates[0].id : undefined
      });
    }
  }, [product, isOpen, taxRates]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Omit<Product, 'id'> & { id?: string });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] shadow-xl">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {product ? 'Update the details of your product.' : 'Fill in the information for the new product.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">Code</Label>
              <Input id="code" name="code" value={formData.code || ''} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right">Unit</Label>
              <Input id="unit" name="unit" value={formData.unit || ''} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="purchasePrice" className="text-right">Purchase Price</Label>
              <Input id="purchasePrice" name="purchasePrice" type="number" step="0.01" value={formData.purchasePrice || 0} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salePrice" className="text-right">Sale Price</Label>
              <Input id="salePrice" name="salePrice" type="number" step="0.01" value={formData.salePrice || 0} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hsnSac" className="text-right">HSN/SAC</Label>
              <Input id="hsnSac" name="hsnSac" value={formData.hsnSac || ''} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taxRateId" className="text-right">Tax Rate</Label>
              <Select name="taxRateId" value={formData.taxRateId} onValueChange={(value) => handleSelectChange('taxRateId', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a tax rate" />
                </SelectTrigger>
                <SelectContent>
                  {taxRates.map(rate => (
                    <SelectItem key={rate.id} value={rate.id}>{rate.name} ({rate.rate}%)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="default" className="shadow-md hover:shadow-lg">{product ? 'Save Changes' : 'Create Product'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
