"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Clock 
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Transaction {
  _id: string;
  userId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  transactionId?: string;
  accountDetails?: string;
  notes?: string;
  createdAt: string;
  userName?: string;
  userEmail?: string;
}

export default function AdminDepositsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  
  // Fetch deposit transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/admin/transactions?type=deposit');
        
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        
        const data = await response.json();
        setTransactions(data.transactions);
        setFilteredTransactions(data.transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error('Failed to load transactions');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  // Apply filters
  useEffect(() => {
    let result = transactions;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((transaction) => 
        transaction.transactionId?.toLowerCase().includes(query) ||
        transaction._id.toLowerCase().includes(query) ||
        transaction.userName?.toLowerCase().includes(query) ||
        transaction.userEmail?.toLowerCase().includes(query) ||
        transaction.amount.toString().includes(query)
      );
    }
    
    // Status filter
    if (statusFilter) {
      result = result.filter((transaction) => transaction.status === statusFilter);
    }
    
    setFilteredTransactions(result);
  }, [searchQuery, statusFilter, transactions]);
  
  const handleApproveTransaction = async () => {
    if (!selectedTransaction) return;
    
    try {
      const response = await fetch(`/api/admin/transactions/${selectedTransaction._id}/approve`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve transaction');
      }
      
      // Update local state
      setTransactions(prevTransactions => 
        prevTransactions.map(transaction => 
          transaction._id === selectedTransaction._id 
            ? { ...transaction, status: 'approved' } 
            : transaction
        )
      );
      
      toast.success('Transaction approved successfully');
      setConfirmDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error approving transaction:', error);
      toast.error('Failed to approve transaction');
    }
  };
  
  const handleRejectTransaction = async () => {
    if (!selectedTransaction) return;
    
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/transactions/${selectedTransaction._id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectReason }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject transaction');
      }
      
      // Update local state
      setTransactions(prevTransactions => 
        prevTransactions.map(transaction => 
          transaction._id === selectedTransaction._id 
            ? { ...transaction, status: 'rejected' } 
            : transaction
        )
      );
      
      toast.success('Transaction rejected successfully');
      setRejectDialogOpen(false);
      setRejectReason('');
      router.refresh();
    } catch (error) {
      console.error('Error rejecting transaction:', error);
      toast.error('Failed to reject transaction');
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" /> Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30">
            <XCircle className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="container py-8 px-4 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Deposit Requests</h1>
        <p className="text-muted-foreground mt-1">
          Manage and approve user deposit requests
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Deposit Transactions</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 w-[200px] sm:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter className="h-4 w-4 mr-2" />
                    {statusFilter ? `Status: ${statusFilter}` : "All Status"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("approved")}>
                    Approved
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>
                    Rejected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell className="font-medium">{transaction._id.substring(0, 8)}</TableCell>
                      <TableCell>{transaction.userName || 'N/A'}</TableCell>
                      <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell>{transaction.transactionId || 'N/A'}</TableCell>
                      <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                      <TableCell>{renderStatusBadge(transaction.status)}</TableCell>
                      <TableCell className="text-right">
                        {transaction.status === 'pending' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTransaction(transaction);
                                  setConfirmDialogOpen(true);
                                }}
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTransaction(transaction);
                                  setRejectDialogOpen(true);
                                }}
                                className="text-red-600"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Approve Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Deposit</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this deposit? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="text-sm text-muted-foreground">Amount:</div>
                <div className="text-sm font-medium">{formatCurrency(selectedTransaction.amount)}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="text-sm text-muted-foreground">Transaction ID:</div>
                <div className="text-sm font-medium">{selectedTransaction.transactionId || 'N/A'}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="text-sm text-muted-foreground">Date:</div>
                <div className="text-sm font-medium">{formatDate(selectedTransaction.createdAt)}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApproveTransaction}>
              Approve Deposit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Deposit</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this deposit.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="text-sm text-muted-foreground">Amount:</div>
                <div className="text-sm font-medium">{formatCurrency(selectedTransaction.amount)}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="text-sm text-muted-foreground">Transaction ID:</div>
                <div className="text-sm font-medium">{selectedTransaction.transactionId || 'N/A'}</div>
              </div>
            </div>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Please provide a reason for rejection"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectTransaction}>
              Reject Deposit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 