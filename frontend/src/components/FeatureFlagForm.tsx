'use client';

import { useState } from 'react';
import { FeatureFlag } from '@/types';
import { featureFlagService } from '@/lib/featureFlags';
import { Input, Textarea, Select, Button } from '@/components/ui';
import { AlertCircle } from 'lucide-react';
import { strings } from '@/lib/strings';

interface FeatureFlagFormData {
  name: string;
  key: string;
  description?: string;
  is_enabled: boolean;
  rollout_type: 'boolean' | 'percentage' | 'scheduled' | 'user_list';
  rollout_value?: any;
  starts_at?: string;
  ends_at?: string;
}

interface FeatureFlagFormProps {
  flag?: FeatureFlag;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function FeatureFlagForm({ flag, onSuccess, onCancel }: FeatureFlagFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FeatureFlagFormData>(flag ? {
    name: flag.name,
    key: flag.key,
    description: flag.description || '',
    is_enabled: flag.is_enabled,
    rollout_type: flag.rollout_type,
    rollout_value: flag.rollout_value,
    starts_at: flag.starts_at ? new Date(flag.starts_at).toISOString().slice(0, 16) : '',
    ends_at: flag.ends_at ? new Date(flag.ends_at).toISOString().slice(0, 16) : '',
  } : {
    name: '',
    key: '',
    description: '',
    is_enabled: false,
    rollout_type: 'boolean',
    rollout_value: {},
    starts_at: '',
    ends_at: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData.rollout_value,
          [child]: type === 'number' ? parseInt(value) || 0 : value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = strings.nameRequired;
    }
    
    if (!formData.key.trim()) {
      newErrors.key = strings.keyRequired;
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.key)) {
      newErrors.key = 'Key must contain only letters, numbers, underscores, and hyphens';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (flag) {
        await featureFlagService.updateFlag(flag.key, formData);
      } else {
        await featureFlagService.createFlag(formData);
      }
      onSuccess();
    } catch {
      setError(strings.errorSaveFlag);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label={strings.name}
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder={strings.namePlaceholder}
            required
          />
          {errors.name && (
            <p className="text-red-600 text-xs mt-1.5">{errors.name}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Input
            label={strings.key}
            name="key"
            value={formData.key}
            onChange={handleInputChange}
            disabled={!!flag}
            placeholder={strings.keyPlaceholder}
            required
          />
          {errors.key && (
            <p className="text-red-600 text-xs mt-1.5">{errors.key}</p>
          )}
          {!flag && (
            <p className="text-neutral-500 text-xs mt-1.5">{strings.keyHint}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Textarea
            label={strings.description}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder={strings.descriptionPlaceholder}
            rows={3}
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <input
              name="is_enabled"
              type="checkbox"
              checked={formData.is_enabled}
              onChange={handleInputChange}
              className="w-4 h-4 text-primary-600 bg-white border-neutral-300 rounded focus:ring-2 focus:ring-primary-500"
            />
            <div>
              <label className="text-sm font-medium text-neutral-900 cursor-pointer">
                {strings.enableFeature}
              </label>
              <p className="text-xs text-neutral-600 mt-0.5">{strings.enableFeatureHint}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <Select
            label={strings.rolloutStrategy}
            name="rollout_type"
            value={formData.rollout_type}
            onChange={handleInputChange}
          >
            <option value="boolean">{strings.rolloutFullDeployment}</option>
            <option value="percentage">{strings.rolloutProgressive}</option>
            <option value="scheduled">{strings.rolloutScheduled}</option>
            <option value="user_list">{strings.rolloutTargeted}</option>
          </Select>
        </div>
      </div>

      {formData.rollout_type === 'percentage' && (
        <div className="p-5 bg-primary-50 border border-primary-200 rounded-lg">
          <label className="block text-sm font-medium text-neutral-900 mb-3">
            {strings.rolloutPercentageSection}
          </label>
          <div className="flex items-center gap-4">
            <input
              name="rollout_value.percentage"
              type="range"
              min="0"
              max="100"
              value={formData.rollout_value?.percentage || 0}
              onChange={handleInputChange}
              className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div className="flex items-center gap-2">
              <input
                name="rollout_value.percentage"
                type="number"
                min="0"
                max="100"
                value={formData.rollout_value?.percentage || 0}
                onChange={handleInputChange}
                className="w-20 px-3 py-2 text-center border border-neutral-300 rounded-lg text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-neutral-700">%</span>
            </div>
          </div>
          <p className="text-xs text-neutral-600 mt-3">{strings.rolloutPercentageHint}</p>
        </div>
      )}

      {formData.rollout_type === 'user_list' && (
        <div className="p-5 bg-purple-50 border border-purple-200 rounded-lg">
          <Input
            label={strings.userEmailAddresses}
            name="rollout_value.user_ids"
            value={formData.rollout_value?.user_ids || ''}
            onChange={handleInputChange}
            placeholder={strings.userEmailPlaceholder}
          />
          <p className="text-xs text-neutral-600 mt-2">{strings.userEmailHint}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-neutral-50 border border-neutral-200 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-neutral-900 mb-2">
            {strings.startDate}
          </label>
          <input
            name="starts_at"
            type="datetime-local"
            value={formData.starts_at}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-900 mb-2">
            {strings.endDate}
          </label>
          <input
            name="ends_at"
            type="datetime-local"
            value={formData.ends_at}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
        <div className="md:col-span-2">
          <p className="text-xs text-neutral-600">{strings.scheduleHint}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
        >
          {strings.cancel}
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
        >
          {loading ? strings.saving : flag ? strings.updateFlag : strings.createFlag}
        </Button>
      </div>
    </form>
  );
}
