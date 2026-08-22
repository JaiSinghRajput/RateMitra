"use client";

import { useState, useEffect } from "react";
import { Loader2, Activity, Plus, Trash2, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@clerk/nextjs";

export default function ActivityFeed() {
  const { t } = useLanguage();
  const { orgId } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  useEffect(() => {
    if (orgId) {
      fetchLogs();
    }
  }, [orgId]);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/logs");
      if (res.ok) {
        setLogs(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setLoadingLogs(false);
    }
  };

  return (
    <div className="bg-surface p-8 rounded-2xl shadow-sm border border-border max-w-4xl mx-auto transition-colors">
      <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
        <Activity className="text-primary" /> {t('orgActivity')}
      </h3>
      
      {loadingLogs ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin h-6 w-6 text-primary" />
        </div>
      ) : logs.length > 0 ? (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log._id} className="flex items-start gap-4 p-4 border border-border rounded-xl bg-background">
              <div className={`mt-1 p-2 rounded-full ${
                log.action === 'CREATE' ? 'bg-success/10 text-success' :
                log.action === 'DELETE' ? 'bg-danger/10 text-danger' :
                'bg-primary-light text-primary'
              }`}>
                {log.action === 'CREATE' ? <Plus className="w-4 h-4" /> :
                 log.action === 'DELETE' ? <Trash2 className="w-4 h-4" /> :
                 <Settings className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <p className="text-text-primary font-medium">
                  {log.userName} <span className="text-text-secondary font-normal">
                    {log.action === 'CREATE' ? t('created') : log.action === 'DELETE' ? t('deleted') : t('updated')}
                  </span> {log.itemName}
                </p>
                {log.details && <p className="text-sm text-text-secondary mt-1">{log.details}</p>}
                <p className="text-xs text-text-secondary mt-2">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-text-secondary font-medium">
          {t('noActivity')}
        </div>
      )}
    </div>
  );
}
