import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DepositForm } from '@/components/dashboard/DepositForm';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export default async function DepositPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Make a Deposit</h1>
          </div>
        <DepositForm />
      </div>
    </DashboardLayout>
  );
} 