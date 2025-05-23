import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

interface Transaction {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  rejectionReason?: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  type: 'deposit' | 'withdraw';
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
}

export function TransactionTable({
  transactions,
  type,
  onApprove,
  onReject,
}: TransactionTableProps) {
  const [rejectReason, setRejectReason] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleApprove = async (id: string) => {
    try {
      await onApprove(id);
      toast({
        title: 'Success',
        description: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} approved successfully`,
      });
    } catch (error) {
      console.error('Error approving transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve transaction',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason) {
      toast({
        title: 'Error',
        description: 'Please provide a rejection reason',
        variant: 'destructive',
      });
      return;
    }

    try {
      await onReject(id, rejectReason);
      setRejectReason('');
      setSelectedId(null);
      toast({
        title: 'Success',
        description: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} rejected successfully`,
      });
    } catch (error) {
      console.error('Error rejecting transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject transaction',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction._id}>
              <TableCell>
                <div>
                  <div className="font-medium">{transaction.userId.name}</div>
                  <div className="text-sm text-gray-500">{transaction.userId.email}</div>
                </div>
              </TableCell>
              <TableCell>${transaction.amount.toFixed(2)}</TableCell>
              <TableCell>{getStatusBadge(transaction.status)}</TableCell>
              <TableCell>
                {format(new Date(transaction.createdAt), 'MMM d, yyyy HH:mm')}
              </TableCell>
              <TableCell>
                {transaction.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(transaction._id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setSelectedId(transaction._id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
                {selectedId === transaction._id && (
                  <div className="mt-2">
                    <textarea
                      className="w-full p-2 border rounded"
                      placeholder="Enter rejection reason"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="mt-2"
                      onClick={() => handleReject(transaction._id)}
                    >
                      Confirm Reject
                    </Button>
                  </div>
                )}
                {transaction.status === 'rejected' && transaction.rejectionReason && (
                  <div className="text-sm text-red-500">
                    Reason: {transaction.rejectionReason}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 