'use client';

import { useState } from 'react';
import { CarReport } from '@/types';
import CarReportList from '@/components/CarReportList';
import CarReportForm from '@/components/CarReportForm';
import CarReportDetail from '@/components/CarReportDetail';
import Layout from '@/components/Layout';
import FeatureDisabled from '@/components/FeatureDisabled';
import { Plus } from 'lucide-react';
import { strings } from '@/lib/strings';
import { Button, Container, Modal } from '@/components/ui';

export default function ReportsPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<CarReport | null>(null);
  const [editingReport, setEditingReport] = useState<CarReport | null>(null);
  const [showFeatureDisabled, setShowFeatureDisabled] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreate = () => {
    setEditingReport(null);
    setShowForm(true);
  };

  const handleEdit = (report: CarReport) => {
    setEditingReport(report);
    setShowForm(true);
  };

  const handleView = (report: CarReport) => {
    setSelectedReport(report);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingReport(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingReport(null);
  };

  const handleCloseDetail = () => {
    setSelectedReport(null);
  };

  return (
    <Layout>
      <Container>
        <div className="py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">{strings.carReports}</h1>
                <p className="text-neutral-600">Manage and track all vehicle damage reports</p>
              </div>
              <Button onClick={handleCreate} variant="primary" className="shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                {strings.newReport}
              </Button>
            </div>
          </div>

          <CarReportList
            onEdit={handleEdit}
            onView={handleView}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </Container>

      {showForm && (
        <Modal
          isOpen={showForm}
          onClose={handleFormCancel}
          title={editingReport ? `Edit ${strings.reportDetails}` : `Create ${strings.reportDetails}`}
        >
          <CarReportForm
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </Modal>
      )}

      {selectedReport && (
        <CarReportDetail
          report={selectedReport}
          onClose={handleCloseDetail}
        />
      )}

      {showFeatureDisabled && (
        <FeatureDisabled
          feature={showFeatureDisabled}
          onClose={() => setShowFeatureDisabled(null)}
        />
      )}
    </Layout>
  );
}
