"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Loader2, TrendingUp, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@clerk/nextjs";

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const { orgId } = useAuth();
  const [data, setData] = useState<{ totalViews: number, viewsOverTime: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orgId) {
      fetchAnalytics();
    }
  }, [orgId]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const chartData = data?.viewsOverTime || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Store Analytics</h2>
        <p className="text-text-secondary mt-1">Track visitors to your public price list.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-text-secondary">Total Views</h3>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-text-primary">{data?.totalViews || 0}</div>
          <p className="text-xs text-success flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> lifetime visits
          </p>
        </div>
      </div>

      <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border">
        <h3 className="text-lg font-bold text-text-primary mb-6">Views (Last 7 Days)</h3>
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text-primary)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="views" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-text-secondary">
              No data available for the last 7 days.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
