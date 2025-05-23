import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

interface DashboardButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  loading?: boolean;
}

export const DashboardButton = forwardRef<HTMLButtonElement, DashboardButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, loading = false, ...props }, ref) => {
    const Comp = asChild ? Slot : Button;
    
    const getVariantClasses = () => {
      switch (variant) {
        case 'default':
          return "bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-semibold shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)]";
        case 'outline':
          return "border-[#FFD700]/20 text-[#FFD700] hover:bg-[#FFD700]/10 shadow-[0_0_20px_rgba(255,215,0,0.1)] hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]";
        case 'ghost':
          return "text-[#FFD700] hover:bg-[#FFD700]/10 hover:text-[#FFD700]";
        default:
          return "bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-semibold shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)]";
      }
    };
    
    return (
      <Comp
        className={cn(
          getVariantClasses(),
          "transition-all duration-300 transform hover:scale-105",
          loading && "opacity-70 cursor-not-allowed",
          className
        )}
        size={size}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      />
    );
  }
);

DashboardButton.displayName = 'DashboardButton'; 