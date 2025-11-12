'use client';

import { useState, useEffect } from 'react';
import { featureFlagService } from '@/lib/featureFlags';
import { TrendingUp, Activity, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/ui';

interface Analytics {
  total_decisions: number;
  enabled_count: number;
  disabled_count: number;
  enabled_percentage: number;
  reasons?: Record<string, number>;
}

interface FeatureFlagAnalyticsProps {
  flagKey: string;
  onClose: () => void;
}

export default function FeatureFlagAnalytics({ flagKey, onClose }: FeatureFlagAnalyticsProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const data = await featureFlagService.getFlagAnalytics(flagKey, 24);
        setAnalytics(data);
      } catch {
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    
    loadAnalytics();
  }, [flagKey]);

  const enabledRate = analytics?.enabled_percentage || 0;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Analytics: ${flagKey}`}
      size="lg"
    >
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent"></div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {analytics && !loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 border border-blue-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium text-blue-700 mb-1">Total Decisions</div>
                  <div className="text-3xl font-bold text-blue-900">{analytics.total_decisions}</div>
                </div>
                <div className="p-3 bg-blue-200 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 p-6 border border-green-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium text-green-700 mb-1">Enabled Rate</div>
                  <div className="text-3xl font-bold text-green-900">{enabledRate}%</div>
                </div>
                <div className="p-3 bg-green-200 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-700" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-700" />
                </div>
                <div className="text-sm font-semibold text-green-900">Enabled</div>
              </div>
              <div className="text-2xl font-bold text-green-600 ml-11">{analytics.enabled_count}</div>
            </div>

            <div className="p-5 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-200 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-700" />
                </div>
                <div className="text-sm font-semibold text-red-900">Disabled</div>
              </div>
              <div className="text-2xl font-bold text-red-600 ml-11">{analytics.disabled_count}</div>
            </div>
          </div>

          {analytics.reasons && Object.keys(analytics.reasons).length > 0 && (
            <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-xl">
              <h4 className="text-sm font-semibold text-neutral-900 mb-4">Decision Breakdown</h4>
              <div className="space-y-2">
                {Object.entries(analytics.reasons).map(([reason, count]) => (
                  <div key={reason} className="flex items-center justify-between p-3 bg-white border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors">
                    <span className="text-sm text-neutral-700 font-medium">{reason}</span>
                    <span className="text-sm font-bold text-neutral-900 bg-neutral-100 px-3 py-1 rounded-md">{count as number}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
