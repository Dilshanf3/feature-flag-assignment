'use client';

import { useState } from 'react';
import { FeatureFlag } from '@/types';
import FeatureFlagList from '@/components/FeatureFlagList';
import FeatureFlagForm from '@/components/FeatureFlagForm';
import FeatureFlagAnalytics from '@/components/FeatureFlagAnalytics';
import Layout from '@/components/Layout';
import { Plus } from 'lucide-react';
import { Button, Container, Modal } from '@/components/ui';

export default function AdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | undefined>();
  const [analyticsFlag, setAnalyticsFlag] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreate = () => {
    setEditingFlag(undefined);
    setShowForm(true);
  };

  const handleEdit = (flag: FeatureFlag) => {
    setEditingFlag(flag);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingFlag(undefined);
    setRefreshKey(prev => prev + 1);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingFlag(undefined);
  };

  const handleViewAnalytics = (key: string) => {
    setAnalyticsFlag(key);
  };

  const handleCloseAnalytics = () => {
    setAnalyticsFlag(null);
  };

  return (
    <Layout>
      <Container>
        <div className="py-6 space-y-6">
          <div className="flex justify-end">
            <Button onClick={handleCreate} variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Flag
            </Button>
          </div>

          <FeatureFlagList
            key={refreshKey}
            onEdit={handleEdit}
            onViewAnalytics={handleViewAnalytics}
          />
        </div>
      </Container>

      {showForm && (
        <Modal
          isOpen={showForm}
          onClose={handleFormCancel}
          title={editingFlag ? 'Edit Feature Flag' : 'Create Feature Flag'}
        >
          <FeatureFlagForm
            flag={editingFlag}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </Modal>
      )}

      {analyticsFlag && (
        <FeatureFlagAnalytics
          flagKey={analyticsFlag}
          onClose={handleCloseAnalytics}
        />
      )}
    </Layout>
  );
}
