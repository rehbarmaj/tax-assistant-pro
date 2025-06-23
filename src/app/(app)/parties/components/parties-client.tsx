
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Party } from '@/lib/types';
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
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Edit, Trash2, Search, Users } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialParties: Party[] = [
  { id: '1', name: 'Global Tech Corp', type: 'Client', businessType: 'Corporation', ntn: '1234567-8', strn: '9876543210', address: '123 Tech Park', city: 'Metropolis', province: 'Central Province', contactPerson: 'John Smith', contactNumber: '555-1234', paymentTerms: 'Net 30' },
  { id: '2', name: 'Office Supplies Inc.', type: 'Vendor', businessType: 'LLC', ntn: '8765432-1', strn: '0123456789', address: '456 Supply Ave', city: 'Gotham', province: 'North Province', contactPerson: 'Jane Doe', contactNumber: '555-5678', paymentTerms: 'Net 60' },
  { id: '3', name: 'Innovate Solutions', type: 'Both', businessType: 'Partnership', ntn: '1122334-5', address: '789 Innovation Dr', city: 'Star City', province: 'West Province', contactPerson: 'Peter Jones', contactNumber: '555-9012', paymentTerms: 'On Receipt' },
];

export function PartiesClient() {
  const [parties, setParties] = useState<Party[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setParties(initialParties);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleOpenDialog = (partyToEdit?: Party) => {
    setEditingParty(partyToEdit || null);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    // Add validation here in real app (e.g., check for transactions)
    if (confirm('Are you sure you want to delete this party? This action cannot be undone.')) {
        setParties(p => p.filter(party => party.id !== id));
    }
  };

  const handleSave = (partyData: Omit<Party, 'id'> & { id?: string }) => {
    if (editingParty && partyData.id) {
      setParties(p => p.map(party => (party.id === partyData.id ? { ...party, ...partyData } : party)));
    } else {
      setParties(p => [...p, { ...partyData, id: String(Date.now()) } as Party]);
    }
    setIsDialogOpen(false);
    setEditingParty(null);
  };

  const filteredParties = useMemo(() => parties.filter(party =>
    party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (party.ntn && party.ntn.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (party.strn && party.strn.toLowerCase().includes(searchTerm.toLowerCase())) ||
    party.city.toLowerCase().includes(searchTerm.toLowerCase())
  ), [parties, searchTerm]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Clients & Vendors</h1>
        </div>
        <Button onClick={() => handleOpenDialog()} variant="default" className="shadow-md hover:shadow-lg">
          <PlusCircle className="mr-2 h-5 w-5" /> Add Party
        </Button>
      </div>
       <div className="mb-6 p-4 border rounded-lg shadow-sm bg-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search by name, tax number, or city..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>NTN</TableHead>
                <TableHead>STRN</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}><Skeleton className="h-5 w-full" /></TableCell>
                  </TableRow>
                ))
              ) : filteredParties.length > 0 ? (
                filteredParties.map(party => (
                  <TableRow key={party.id}>
                    <TableCell className="font-medium">{party.name}</TableCell>
                    <TableCell>
                      <Badge variant={party.type === 'Client' ? 'secondary' : party.type === 'Vendor' ? 'outline' : 'default'}>
                        {party.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{party.ntn || 'N/A'}</TableCell>
                    <TableCell>{party.strn || 'N/A'}</TableCell>
                    <TableCell>{party.city}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(party)} className="hover:text-primary">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(party.id)} className="hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No parties found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isDialogOpen && (
        <PartyDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSave}
          party={editingParty}
        />
      )}
    </div>
  );
}

interface PartyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partyData: Omit<Party, 'id'> & { id?: string }) => void;
  party: Party | null;
}

function PartyDialog({ isOpen, onClose, onSave, party }: PartyDialogProps) {
  const [formData, setFormData] = useState<Partial<Party>>({});

  useEffect(() => {
    if (isOpen) {
      if (party) {
        setFormData(party);
      } else {
        setFormData({
            name: '',
            type: 'Client',
            businessType: '',
            address: '',
            city: '',
            province: '',
        });
      }
    }
  }, [party, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: 'Client' | 'Vendor' | 'Both') => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.city || !formData.province || !formData.address) {
        alert("Name, Type, Address, City, and Province are required.");
        return;
    }
    onSave(formData as Omit<Party, 'id'> & { id?: string });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle>{party ? 'Edit Party' : 'Add New Party'}</DialogTitle>
          <DialogDescription>
            Manage client and vendor information here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Legal Name</Label>
              <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="type">Party Type</Label>
                <Select name="type" value={formData.type} onValueChange={(value: 'Client' | 'Vendor' | 'Both') => handleSelectChange('type', value)} required>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Client">Client</SelectItem>
                        <SelectItem value="Vendor">Vendor</SelectItem>
                        <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Input id="businessType" name="businessType" value={formData.businessType || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Input id="paymentTerms" name="paymentTerms" value={formData.paymentTerms || ''} onChange={handleChange} placeholder="e.g., Net 30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ntn">NTN (Income Tax #)</Label>
              <Input id="ntn" name="ntn" value={formData.ntn || ''} onChange={handleChange} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="strn">STRN (Sales Tax #)</Label>
              <Input id="strn" name="strn" value={formData.strn || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={formData.address || ''} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" value={formData.city || ''} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Province/State</Label>
              <Input id="province" name="province" value={formData.province || ''} onChange={handleChange} required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input id="contactPerson" name="contactPerson" value={formData.contactPerson || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input id="contactNumber" name="contactNumber" value={formData.contactNumber || ''} onChange={handleChange} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{party ? 'Save Changes' : 'Create Party'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
