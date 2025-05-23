import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  footer?: ReactNode;
  headerAction?: ReactNode;
}

export function DashboardCard({
  children,
  className,
  title,
  description,
  footer,
  headerAction,
}: DashboardCardProps) {
  return (
    <Card 
      className={cn(
        "border border-[#FFD700]/20 bg-[#0D1117]/60 backdrop-blur supports-[backdrop-filter]:bg-[#0D1117]/60 shadow-[0_0_20px_rgba(255,215,0,0.1)] hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] transition-all duration-300 relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#FFD700] to-[#FFD700]/50 opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
      
      {(title || description) && (
        <CardHeader className={headerAction ? "flex flex-row items-center justify-between space-y-0 pb-2" : ""}>
          <div>
            {title && <CardTitle className="text-xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">{title}</CardTitle>}
            {description && <CardDescription className="text-gray-400 mt-1">{description}</CardDescription>}
          </div>
          {headerAction && (
            <div>{headerAction}</div>
          )}
        </CardHeader>
      )}
      
      <CardContent>{children}</CardContent>
      
      {footer && (
        <CardFooter className="border-t border-[#FFD700]/10 bg-[#0D1117]/80">{footer}</CardFooter>
      )}
    </Card>
  );
} 