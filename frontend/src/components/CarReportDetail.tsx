'use client';

import { CarReport } from '@/types';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { X, Calendar, Car, AlertCircle } from 'lucide-react';
import { strings } from '@/lib/strings';
import { FEATURE_FLAGS } from '@/lib/constants';
import { Badge, Card } from '@/components/ui';

interface CarReportDetailProps {
  report: CarReport;
  onClose: () => void;
}

export default function CarReportDetail({ report, onClose }: CarReportDetailProps) {
  const { enabled: premiumAnalyticsEnabled } = useFeatureFlag(FEATURE_FLAGS.PREMIUM_ANALYTICS);

  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'neutral' => {
    if (status === 'approved') return 'success';
    if (status === 'rejected') return 'danger';
    return 'warning';
  };

  const getDamageVariant = (damageType: string): 'success' | 'warning' | 'danger' | 'info' => {
    if (damageType === 'minor') return 'info';
    if (damageType === 'moderate') return 'warning';
    return 'danger';
  };

  const getSeverityLabel = (damageType: string) => {
    if (damageType === 'minor') return strings.low;
    if (damageType === 'moderate') return strings.medium;
    if (damageType === 'severe') return strings.high;
    if (damageType === 'total_loss') return strings.critical;
    return strings.unknown;
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-start justify-center pt-20 px-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-semibold text-neutral-900">{strings.reportDetails}</h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-neutral-100 rounded-xl">
              <Car className="w-6 h-6 text-neutral-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{report.car_model}</h3>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusVariant(report.status)}>
                  {strings[report.status as keyof typeof strings] || report.status}
                </Badge>
              </div>
            </div>
          </div>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-neutral-900 mb-1">{strings.damageAssessment}</h4>
                <p className="text-sm text-neutral-600">
                  {getSeverityLabel(report.damage_type)} {strings.severity}
                </p>
              </div>
              <Badge variant={getDamageVariant(report.damage_type)} className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {strings[report.damage_type?.replace('_', '') as keyof typeof strings] || report.damage_type}
              </Badge>
            </div>
          </Card>

          <div>
            <h4 className="font-medium text-neutral-900 mb-3">{strings.description}</h4>
            <Card className="bg-neutral-50">
              <p className="text-neutral-700 leading-relaxed">
                {report.description}
              </p>
            </Card>
          </div>

          {report.photo_url && (
            <div>
              <h4 className="font-medium text-neutral-900 mb-3">{strings.photo}</h4>
              <Card className="p-0 overflow-hidden">
                <img
                  src={report.photo_url}
                  alt="Car damage"
                  className="w-full h-auto"
                />
              </Card>
            </div>
          )}

          {premiumAnalyticsEnabled && (
            <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 border-purple-200">
              <h4 className="font-semibold text-neutral-900 mb-4">{strings.premiumAnalytics}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">{strings.similarCases}:</p>
                  <p className="text-lg font-semibold text-purple-900">23 found</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-1">{strings.avgProcessingTime}:</p>
                  <p className="text-lg font-semibold text-purple-900">2.3 days</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-1">{strings.successRate}:</p>
                  <p className="text-lg font-semibold text-purple-900">94%</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-1">{strings.riskScore}:</p>
                  <p className="text-lg font-semibold text-purple-900">{strings.low}</p>
                </div>
              </div>
            </Card>
          )}

          <div className="pt-4 border-t border-neutral-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>{strings.created}</span>
                </div>
                <p className="text-sm font-medium text-neutral-900">
                  {new Date(report.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>{strings.updated}</span>
                </div>
                <p className="text-sm font-medium text-neutral-900">
                  {new Date(report.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
