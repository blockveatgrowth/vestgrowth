"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Broadcast the refresh event for other components to listen to
    window.dispatchEvent(new CustomEvent('dashboard:refresh', { 
      detail: { timestamp: Date.now() } 
    }));
    
    // Show toast and reset state
    toast.success("Dashboard data refreshed");
    
    // Simulate a loading state
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="gap-1  bg-blue-400"
    >
      <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
      <span>Refresh</span>
    </Button>
  );
} 