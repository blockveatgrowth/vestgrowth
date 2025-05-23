"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ProcessIncrementsButton() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleProcessIncrements = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch("/api/admin/increments/process", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to process increments");
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: "Daily increments processed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process increments",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handleProcessIncrements}
      disabled={isProcessing}
      className="gap-2"
    >
      <Calculator className="h-4 w-4" />
      {isProcessing ? "Processing..." : "Daily Profit"}
    </Button>
  );
} 