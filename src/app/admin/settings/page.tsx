"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Wallet, TrendingUp, Gift, Settings2, RefreshCw } from "lucide-react";

interface Settings {
  wallets: { trc20: string; erc20: string; bep20: string };
  welcomeBonus: number;
  referralBonus: number;
  withdrawalThreshold: number;
  tradeEnabled: boolean;
  tradeMinProfit: number;
  tradeMaxProfit: number;
  tradeMinLoss: number;
  tradeMaxLoss: number;
  tradeLossDaysPerWeek: number;
  planProfitCuts: { plan1: number; plan2: number; plan3: number; plan4: number };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateTrade = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/trade/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Trade generated successfully!");
      } else {
        toast.error(data.error || "Failed to generate trade");
      }
    } catch {
      toast.error("Failed to generate trade");
    } finally {
      setGenerating(false);
    }
  };

  const update = (path: string, value: string | number | boolean) => {
    if (!settings) return;
    const keys = path.split(".");
    const updated = { ...settings } as Record<string, unknown>;
    let current = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...(current[keys[i]] as Record<string, unknown>) };
      current = current[keys[i]] as Record<string, unknown>;
    }
    current[keys[keys.length - 1]] = value;
    setSettings(updated as Settings);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#FFD700]" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="container py-8 px-4 md:px-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#FFD700]">Platform Settings</h1>
          <p className="text-gray-400 mt-1">Configure wallets, bonuses, trade engine, and more</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-bold"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save All Settings
        </Button>
      </div>

      {/* Wallet Addresses */}
      <Card className="border-[#FFD700]/20 bg-[#0D1117]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#FFD700]">
            <Wallet className="h-5 w-5" /> Deposit Wallet Addresses
          </CardTitle>
          <CardDescription className="text-gray-400">
            These addresses are shown to users when they make a deposit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(["trc20", "erc20", "bep20"] as const).map((network) => (
            <div key={network}>
              <label className="text-sm font-medium text-gray-300 uppercase mb-1 block">
                {network} Address
              </label>
              <Input
                value={settings.wallets[network]}
                onChange={(e) => update(`wallets.${network}`, e.target.value)}
                className="bg-black/30 border-[#FFD700]/20 text-white font-mono text-sm"
                placeholder={`Enter ${network.toUpperCase()} wallet address`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Bonus Settings */}
      <Card className="border-[#FFD700]/20 bg-[#0D1117]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#FFD700]">
            <Gift className="h-5 w-5" /> Bonus & Threshold Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1 block">
              Welcome Bonus ($)
            </label>
            <Input
              type="number"
              value={settings.welcomeBonus}
              onChange={(e) => update("welcomeBonus", parseFloat(e.target.value))}
              className="bg-black/30 border-[#FFD700]/20 text-white"
            />
            <p className="text-xs text-gray-500 mt-1">Fixed $ bonus for new users</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1 block">
              Referral Bonus (%)
            </label>
            <Input
              type="number"
              value={settings.referralBonus}
              onChange={(e) => update("referralBonus", parseFloat(e.target.value))}
              className="bg-black/30 border-[#FFD700]/20 text-white"
            />
            <p className="text-xs text-gray-500 mt-1">% of first deposit to referrer</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1 block">
              Withdrawal Threshold ($)
            </label>
            <Input
              type="number"
              value={settings.withdrawalThreshold}
              onChange={(e) => update("withdrawalThreshold", parseFloat(e.target.value))}
              className="bg-black/30 border-[#FFD700]/20 text-white"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum balance to withdraw</p>
          </div>
        </CardContent>
      </Card>

      {/* Plan Profit Cuts */}
      <Card className="border-[#FFD700]/20 bg-[#0D1117]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#FFD700]">
            <TrendingUp className="h-5 w-5" /> Plan Profit Distribution (%)
          </CardTitle>
          <CardDescription className="text-gray-400">
            What % of the daily trade profit is credited to users in each plan
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {([1, 2, 3, 4] as const).map((n) => (
            <div key={n}>
              <label className="text-sm font-medium text-gray-300 mb-1 block">
                Plan {n} Cut (%)
              </label>
              <Input
                type="number"
                value={settings.planProfitCuts[`plan${n}` as keyof typeof settings.planProfitCuts]}
                onChange={(e) =>
                  update(`planProfitCuts.plan${n}`, parseFloat(e.target.value))
                }
                className="bg-black/30 border-[#FFD700]/20 text-white"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Trade Engine */}
      <Card className="border-[#FFD700]/20 bg-[#0D1117]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#FFD700]">
            <Settings2 className="h-5 w-5" /> Trade Simulation Engine
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure the automated daily crypto trade simulation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="tradeEnabled"
              checked={settings.tradeEnabled}
              onChange={(e) => update("tradeEnabled", e.target.checked)}
              className="w-5 h-5 rounded border-[#FFD700]/20 bg-black/20 text-[#FFD700]"
            />
            <label htmlFor="tradeEnabled" className="text-gray-300 font-medium">
              Enable Automated Daily Trade Generation
            </label>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">Min Profit (%)</label>
              <Input
                type="number"
                step="0.1"
                value={settings.tradeMinProfit}
                onChange={(e) => update("tradeMinProfit", parseFloat(e.target.value))}
                className="bg-black/30 border-[#FFD700]/20 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">Max Profit (%)</label>
              <Input
                type="number"
                step="0.1"
                value={settings.tradeMaxProfit}
                onChange={(e) => update("tradeMaxProfit", parseFloat(e.target.value))}
                className="bg-black/30 border-[#FFD700]/20 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">Min Loss (%)</label>
              <Input
                type="number"
                step="0.1"
                value={settings.tradeMinLoss}
                onChange={(e) => update("tradeMinLoss", parseFloat(e.target.value))}
                className="bg-black/30 border-[#FFD700]/20 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1 block">Max Loss (%)</label>
              <Input
                type="number"
                step="0.1"
                value={settings.tradeMaxLoss}
                onChange={(e) => update("tradeMaxLoss", parseFloat(e.target.value))}
                className="bg-black/30 border-[#FFD700]/20 text-white"
              />
            </div>
          </div>

          <div className="max-w-xs">
            <label className="text-sm font-medium text-gray-300 mb-1 block">
              Loss Days Per Week
            </label>
            <Input
              type="number"
              min={0}
              max={6}
              value={settings.tradeLossDaysPerWeek}
              onChange={(e) => update("tradeLossDaysPerWeek", parseInt(e.target.value))}
              className="bg-black/30 border-[#FFD700]/20 text-white"
            />
            <p className="text-xs text-gray-500 mt-1">How many days per week show a loss (0-6)</p>
          </div>

          <div className="pt-2 border-t border-[#FFD700]/10">
            <Button
              onClick={handleGenerateTrade}
              disabled={generating}
              variant="outline"
              className="border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Generate Today&apos;s Trade Now
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Manually trigger today&apos;s trade generation. Normally runs automatically at midnight.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
