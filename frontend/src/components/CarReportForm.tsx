'use client';

import { useState } from 'react';
import { carReportService } from '@/lib/carReports';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { Camera } from 'lucide-react';
import { FEATURE_FLAGS } from '@/lib/constants';
import { strings } from '@/lib/strings';

interface CarReportFormData {
  car_model: string;
  description: string;
  damage_type: 'minor' | 'moderate' | 'severe' | 'total_loss';
  photo?: File | null;
}

interface CarReportFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CarReportForm({ onSuccess, onCancel }: CarReportFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { enabled: uploadPhotosEnabled } = useFeatureFlag(FEATURE_FLAGS.UPLOAD_PHOTOS);

  const [formData, setFormData] = useState<CarReportFormData>({
    car_model: '',
    description: '',
    damage_type: 'minor',
    photo: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhotoPreview(result);
      };
      reader.readAsDataURL(file);
      setFormData({ ...formData, photo: file });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.car_model.trim()) {
      newErrors.car_model = strings.carModelValidation;
    }
    
    if (!formData.description.trim()) {
      newErrors.description = strings.descriptionValidation;
    } else if (formData.description.trim().length < 10) {
      newErrors.description = strings.descriptionMinLength;
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
      await carReportService.createReport(formData);
      onSuccess();
    } catch (err) {
      setError('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {strings.carModelRequired}
        </label>
        <input
          name="car_model"
          value={formData.car_model}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder={strings.enterCarModel}
        />
        {errors.car_model && (
          <p className="text-red-500 text-sm mt-1">{errors.car_model}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {strings.damageTypeRequired}
        </label>
        <select
          name="damage_type"
          value={formData.damage_type}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="minor">{strings.damageMinor}</option>
          <option value="moderate">{strings.damageModerate}</option>
          <option value="severe">{strings.damageSevere}</option>
          <option value="total_loss">{strings.damageTotalLoss}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {strings.descriptionRequired}
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={4}
          placeholder={strings.describeDamage}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {uploadPhotosEnabled && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {strings.photoUploadOptional}
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
            <div className="space-y-1 text-center">
              {photoPreview ? (
                <div className="space-y-2">
                  <img
                    src={photoPreview}
                    alt={strings.previewAlt}
                    className="mx-auto h-32 w-auto rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview(null);
                      setFormData({ ...formData, photo: null });
                    }}
                    className="text-sm text-red-600 hover:text-red-500"
                  >
                    {strings.removePhoto}
                  </button>
                </div>
              ) : (
                <div>
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="photo-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500"
                    >
                      <span>{strings.uploadPhotoLabel}</span>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">{strings.dragAndDropPhoto}</p>
                  </div>
                  <p className="text-xs text-gray-500">{strings.photoFormats}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          {strings.cancel}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? strings.submitting : strings.submitReport}
        </button>
      </div>
    </form>
  );
}
