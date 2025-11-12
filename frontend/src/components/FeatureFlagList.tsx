'use client';

import { useState, useEffect } from 'react';
import { FeatureFlag } from '@/types';
import { featureFlagService } from '@/lib/featureFlags';
import { Edit2, Trash2, BarChart3, Zap, Calendar, Percent, Users, AlertCircle, Camera, Search, LayoutDashboard, Sparkles, Smartphone, TrendingUp } from 'lucide-react';
import { strings } from '@/lib/strings';
import { Card, Badge, Button } from '@/components/ui';

interface FeatureFlagListProps {
  onEdit: (flag: FeatureFlag) => void;
  onViewAnalytics: (key: string) => void;
}

export default function FeatureFlagList({ onEdit, onViewAnalytics }: FeatureFlagListProps) {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    try {
      setLoading(true);
      const data = await featureFlagService.getAllFlags();
      setFlags(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : strings.errorLoading);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (confirm('Are you sure you want to delete this feature flag?')) {
      try {
        await featureFlagService.deleteFlag(key);
        setFlags(flags.filter(flag => flag.key !== key));
      } catch (err) {
        setError(err instanceof Error ? err.message : strings.errorLoading);
      }
    }
  };

  const getFeatureIcon = (key: string) => {
    if (key.includes('photo') || key.includes('upload')) {
      return { icon: Camera, color: 'from-purple-500 to-pink-500' };
    }
    if (key.includes('search') || key.includes('analytics')) {
      return { icon: Search, color: 'from-primary-500 to-primary-600' };
    }
    if (key.includes('dashboard') || key.includes('beta')) {
      return { icon: LayoutDashboard, color: 'from-primary-400 to-primary-600' };
    }
    if (key.includes('ai') || key.includes('assessment')) {
      return { icon: Sparkles, color: 'from-amber-500 to-orange-500' };
    }
    if (key.includes('mobile') || key.includes('app')) {
      return { icon: Smartphone, color: 'from-green-500 to-emerald-500' };
    }
    if (key.includes('premium') || key.includes('advanced')) {
      return { icon: TrendingUp, color: 'from-rose-500 to-red-500' };
    }
    return { icon: Zap, color: 'from-primary-500 to-primary-600' };
  };

  const getRolloutIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return Percent;
      case 'user':
        return Users;
      case 'scheduled':
        return Calendar;
      default:
        return Zap;
    }
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

  return (
    <div className="space-y-4">
      {flags.length === 0 ? (
        <Card className="text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-neutral-100 rounded-xl">
              <Zap className="w-12 h-12 text-neutral-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">{strings.noFeatureFlags}</h3>
              <p className="text-neutral-600 mt-1">{strings.createFirstFlag}</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {flags.map((flag) => {
            const featureIcon = getFeatureIcon(flag.key);
            const FeatureIconComponent = featureIcon.icon;
            const RolloutIcon = getRolloutIcon(flag.rollout_type);
            
            return (
              <Card key={flag.key} className="hover:shadow-lg transition-all duration-200">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-3 bg-gradient-to-br ${featureIcon.color} rounded-xl shadow-sm flex-shrink-0`}>
                      <FeatureIconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-neutral-900 mb-1 truncate">
                        {flag.name}
                      </h3>
                      <p className="text-xs font-mono text-neutral-500 truncate">
                        {flag.key}
                      </p>
                    </div>
                    <Badge 
                      variant={flag.is_enabled ? 'success' : 'danger'}
                      className="text-xs"
                    >
                      {flag.is_enabled ? 'ON' : 'OFF'}
                    </Badge>
                  </div>
                  
                  {flag.description && (
                    <p className="text-sm text-neutral-600 line-clamp-2">
                      {flag.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-neutral-100 rounded text-xs">
                      <RolloutIcon className="w-3.5 h-3.5 text-neutral-600" />
                      <span className="text-neutral-700 font-medium capitalize">{flag.rollout_type}</span>
                    </div>
                    
                    {flag.starts_at && (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-primary-50 rounded text-xs">
                        <Calendar className="w-3.5 h-3.5 text-primary-600" />
                        <span className="text-primary-700">{new Date(flag.starts_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100">
                    <Button
                      onClick={() => onViewAnalytics(flag.key)}
                      variant="secondary"
                      size="sm"
                      className="text-xs"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      onClick={() => onEdit(flag)}
                      variant="primary"
                      size="sm"
                      className="text-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(flag.key)}
                      variant="danger"
                      size="sm"
                      className="text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
