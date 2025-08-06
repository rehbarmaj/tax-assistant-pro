
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Step1 from './steps/step1';
import Step2 from './steps/step2';
import Step3 from './steps/step3';
import Step4 from './steps/step4';
import Step5 from './steps/step5';

const FinancialYearClosingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    fiscalYear: '',
    checklist: {
      allTransactionsRecorded: false,
      bankStatementsReconciled: false,
      accrualsReviewed: false,
    },
    preliminaryReportReview: '',
    preliminaryReportsReviewed: false,
    adjustingEntries: [],
    reviewedAndConfirmed: false,
  });

  const steps = [
    { name: 'Pre-closing Checklist', component: Step1 },
    { name: 'Data Verification', component: Step2 },
    { name: 'Adjusting Entries', component: Step3 },
    { name: 'Reporting', component: Step4 },
    { name: 'Completion', component: Step5 },
  ];

  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = (stepData?: any) => {
    setFormData((prev: any) => ({ ...prev, ...stepData }));
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleFinalize = (stepData?: any) => {
    const finalData = { ...formData, ...stepData };
    setFormData(finalData);
    console.log('Finalizing financial year closing process with data:', finalData);
    setCurrentStep(currentStep + 1);
  };
  
  const renderStepContent = () => {
    const StepComponent = steps[currentStep].component;

    const commonProps = {
        formData,
        setFormData,
        onNext: handleNext,
        onBack: handleBack,
    };

    switch (currentStep) {
        case 0:
            return <Step1 {...commonProps} />;
        case 1:
            return <Step2 {...commonProps} />;
        case 2:
            return <Step3 {...commonProps} />;
        case 3:
            return <Step4 {...commonProps} finalizeClosing={handleFinalize} reviewData={formData} />;
        case 4:
            return <Step5 />;
        default:
            return null;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-screen-md">
      <h1 className="text-2xl font-bold mb-4">Financial Year Closing Wizard</h1>
      <Progress value={progress} className="w-full mb-6" />
      <div className="step-content">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default FinancialYearClosingWizard;
