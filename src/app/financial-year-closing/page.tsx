
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Loader2, ArrowRight, ArrowLeft, PartyPopper } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const steps = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'pre-closing', title: 'Pre-Closing Checks' },
    { id: 'final-entries', title: 'Final Entries' },
    { id: 'review', title: 'Review & Finalize' },
    { id: 'completion', title: 'Completion' },
];

const preClosingTasks = [
    "Reconcile all balance sheet accounts.",
    "Perform physical inventory count and valuation.",
    "Clean up accounts receivable and payable ledgers.",
    "Review fixed assets and depreciation schedules.",
    "Accrue for all known liabilities and expenses."
];

const finalEntryTasks = [
    "Process all remaining transactions for the fiscal year.",
    "Complete all necessary journal entries (accruals, prepayments).",
    "Reconcile all bank statements.",
    "Calculate and record final depreciation and amortization.",
    "Post intercompany transaction adjustments."
];

const FinancialYearClosingPage = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckboxChange = (task: string) => {
        setCheckedTasks(prev => ({ ...prev, [task]: !prev[task] }));
    };

    const isCurrentStepComplete = () => {
        if (steps[currentStep].id === 'pre-closing') {
            return preClosingTasks.every(task => checkedTasks[task]);
        }
        if (steps[currentStep].id === 'final-entries') {
            return finalEntryTasks.every(task => checkedTasks[task]);
        }
        return true;
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    const handleFinalize = () => {
        setIsProcessing(true);
        // Simulate a network request to the backend to close the year
        setTimeout(() => {
            setIsProcessing(false);
            setCurrentStep(currentStep + 1);
        }, 2000);
    };

    const renderStepContent = () => {
        const stepId = steps[currentStep].id;
        switch (stepId) {
            case 'introduction':
                return (
                    <CardContent>
                        <CardTitle className="mb-4">Welcome to the Financial Year-End Closing Wizard</CardTitle>
                        <p className="text-muted-foreground">This wizard will guide you through the process of closing your financial year. Following these steps carefully will help ensure an accurate and smooth year-end closing.</p>
                        <p className="text-muted-foreground mt-4">Please ensure you have all necessary documents and reports available before you begin.</p>
                    </CardContent>
                );
            case 'pre-closing':
                return (
                    <CardContent>
                        <CardTitle className="mb-4">Phase 1: Pre-Closing Checklist</CardTitle>
                        <p className="text-muted-foreground mb-6">Complete these tasks before moving to final entries. Check each item as you complete it.</p>
                        <div className="space-y-4">
                            {preClosingTasks.map(task => (
                                <div key={task} className="flex items-center space-x-2">
                                    <Checkbox id={task} checked={checkedTasks[task]} onCheckedChange={() => handleCheckboxChange(task)} />
                                    <label htmlFor={task} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{task}</label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                );
             case 'final-entries':
                return (
                    <CardContent>
                        <CardTitle className="mb-4">Phase 2: Final Entries Checklist</CardTitle>
                        <p className="text-muted-foreground mb-6">Post all final journal entries for the fiscal year.</p>
                        <div className="space-y-4">
                            {finalEntryTasks.map(task => (
                                <div key={task} className="flex items-center space-x-2">
                                    <Checkbox id={task} checked={checkedTasks[task]} onCheckedChange={() => handleCheckboxChange(task)} />
                                    <label htmlFor={task} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{task}</label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                );
            case 'review':
                return (
                    <CardContent>
                        <CardTitle className="mb-4">Final Review</CardTitle>
                        <p className="text-muted-foreground mb-4">You are about to close the financial year. This action is irreversible and will perform the following:</p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                           <li>Transfer profit & loss balances to the capital account.</li>
                           <li>Set the closing balances for all asset and liability accounts.</li>
                           <li>Lock all transactions for the current financial year.</li>
                        </ul>
                         <Alert variant="destructive">
                            <AlertTitle>Warning!</AlertTitle>
                            <AlertDescription>
                                Please ensure you have taken a full backup of your data before proceeding. Once the year is closed, you cannot make any changes to the transactions of this period.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                );
            case 'completion':
                 return (
                    <CardContent className="text-center">
                        <PartyPopper className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <CardTitle className="mb-4 text-2xl">Financial Year Closed Successfully!</CardTitle>
                        <p className="text-muted-foreground">The closing balances have been transferred and the new financial year is now active.</p>
                        <p className="text-muted-foreground mt-2">You can now start entering transactions for the new period.</p>
                    </CardContent>
                );
            default:
                return null;
        }
    };


    return (
        <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold mb-2">Financial Year Closing</h1>
            <p className="text-muted-foreground mb-6">Follow the steps to close the books for the current financial year.</p>

            <Card className="shadow-lg">
                <CardHeader>
                    <Progress value={(currentStep / (steps.length -1)) * 100} className="mb-4" />
                    <CardTitle>Step {currentStep + 1}: {steps[currentStep].title}</CardTitle>
                </CardHeader>
                
                {renderStepContent()}

                {steps[currentStep].id !== 'completion' && (
                    <>
                    <Separator />
                    <CardFooter className="flex justify-between pt-6">
                        <Button variant="outline" onClick={handleBack} disabled={currentStep === 0 || isProcessing}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>

                        {steps[currentStep].id === 'review' ? (
                             <Button onClick={handleFinalize} disabled={isProcessing}>
                                {isProcessing ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                                ) : (
                                    <><CheckCircle className="mr-2 h-4 w-4" /> Finalize Year End</>
                                )}
                            </Button>
                        ) : (
                            <Button onClick={handleNext} disabled={!isCurrentStepComplete() || isProcessing}>
                                Next <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </CardFooter>
                    </>
                )}
            </Card>
        </div>
    );
};

export default FinancialYearClosingPage;
