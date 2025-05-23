import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface TransactionStats {
  pending: {
    count: number;
    totalAmount: number;
  };
  approved: {
    count: number;
    totalAmount: number;
  };
  rejected: {
    count: number;
    totalAmount: number;
  };
}

interface TransactionStatsProps {
  deposits: TransactionStats;
  withdrawals: TransactionStats;
  startDate?: Date;
  endDate?: Date;
}

export function TransactionStats({
  deposits,
  withdrawals,
  startDate,
  endDate,
}: TransactionStatsProps) {
  const renderStats = (stats: TransactionStats, type: 'deposits' | 'withdrawals') => (
    <div className="grid grid-cols-3 gap-4">
      {Object.entries(stats).map(([status, data]) => (
        <Card key={status}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {status.charAt(0).toUpperCase() + status.slice(1)} {type}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.totalAmount.toFixed(2)}</div>
            <div className="text-sm text-gray-500">{data.count} transactions</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Transaction Statistics</h2>
        {(startDate || endDate) && (
          <div className="text-sm text-gray-500">
            {startDate && `From: ${format(startDate, 'MMM d, yyyy')}`}
            {startDate && endDate && ' - '}
            {endDate && `To: ${format(endDate, 'MMM d, yyyy')}`}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Deposits</h3>
          {renderStats(deposits, 'deposits')}
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Withdrawals</h3>
          {renderStats(withdrawals, 'withdrawals')}
        </div>
      </div>
    </div>
  );
} 