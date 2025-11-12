'use client';

import { useState, useEffect } from 'react';
import { CarReport } from '@/types';
import { carReportService } from '@/lib/carReports';
import { Edit2, Eye, Calendar, Car, AlertCircle } from 'lucide-react';
import { strings } from '@/lib/strings';
import { Card, Badge, Button } from '@/components/ui';

interface CarReportListProps {
  onEdit: (report: CarReport) => void;
  onView: (report: CarReport) => void;
  refreshTrigger?: number;
}

export default function CarReportList({ onEdit, onView, refreshTrigger }: CarReportListProps) {
  const [reports, setReports] = useState<CarReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, [refreshTrigger]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await carReportService.getAllReports();
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : strings.errorLoading);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'neutral' => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const getDamageVariant = (damageType: string): 'success' | 'warning' | 'danger' | 'info' => {
    if (damageType === 'minor') return 'info';
    if (damageType === 'moderate') return 'warning';
    return 'danger';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-damage-critical">
        <div className="flex items-center gap-3 text-damage-critical">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </Card>
    );
  }

  if (reports.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-neutral-100 rounded-full">
            <Car className="w-12 h-12 text-neutral-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">{strings.noReports}</h3>
            <p className="text-neutral-600 mt-1">{strings.submitFirstReport}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {reports.map((report) => (
        <Card key={report.id} className="flex flex-col h-full hover:shadow-lg transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-neutral-100 rounded-lg">
                <Car className="w-5 h-5 text-neutral-700" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">{report.car_model || strings.unknown}</h3>
                <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  <span>{report.created_at ? new Date(report.created_at).toLocaleDateString() : strings.unknown}</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-neutral-600 mb-4 flex-1 line-clamp-3">
            {report.description || strings.noData}
          </p>

          <div className="flex items-center gap-2 mb-4">
            <Badge variant={getStatusVariant(report.status)}>
              {strings[report.status as keyof typeof strings] || report.status}
            </Badge>
            <Badge variant={getDamageVariant(report.damage_type)} className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {strings[report.damage_type?.replace('_', '') as keyof typeof strings] || report.damage_type}
            </Badge>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-neutral-200">
            <Button
              onClick={() => onView(report)}
              variant="secondary"
              size="sm"
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              {strings.view}
            </Button>
            <Button
              onClick={() => onEdit(report)}
              variant="primary"
              size="sm"
              className="flex-1"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {strings.edit}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
