import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  FileCheck2,
  Globe2,
  Landmark,
  ShieldCheck,
  BellRing,
  Building2
} from 'lucide-react';

type ServiceField = {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'date' | 'textarea';
  required?: boolean;
};

type ServiceCategory = {
  id: string;
  title: string;
  icon: typeof Building2;
  services: string[];
  fields: ServiceField[];
};

const contactFields: ServiceField[] = [
  { name: 'contactName', label: 'Your name', required: true },
  { name: 'phone', label: 'Mobile number', type: 'tel', required: true },
  { name: 'email', label: 'Email address', type: 'email' }
];

const serviceCategories: ServiceCategory[] = [
  {
    id: 'registrations',
    title: 'Registrations',
    icon: Building2,
    services: [
      'GST Registration',
      'Private Limited Company Registration',
      'Limited Liability Partnership (LLP) Registration',
      'Trademark Certificate',
      'FSSAI Food License'
    ],
    fields: [
      ...contactFields,
      { name: 'businessName', label: 'Business or applicant name', required: true },
      { name: 'businessActivity', label: 'Business activity' },
      { name: 'pan', label: 'PAN / existing GSTIN' },
      { name: 'businessAddress', label: 'Business address', type: 'textarea' }
    ]
  },
  {
    id: 'filings',
    title: 'Filings',
    icon: FileCheck2,
    services: ['GST Filing', 'Income Tax Return Filing', 'Annual Company Filing', 'Other Filing'],
    fields: [
      ...contactFields,
      { name: 'applicantName', label: 'Applicant or business name', required: true },
      { name: 'financialYear', label: 'Financial year / filing period' },
      { name: 'panGstin', label: 'PAN / GSTIN' },
      { name: 'filingDetails', label: 'What filing assistance do you need?', type: 'textarea', required: true }
    ]
  },
  {
    id: 'notices',
    title: 'Notices',
    icon: BellRing,
    services: ['Income Tax Notice Handling', 'GST Notice Handling', 'Any Other Notice'],
    fields: [
      ...contactFields,
      { name: 'noticeNumber', label: 'Notice reference number' },
      { name: 'receivedDate', label: 'Date received', type: 'date' },
      { name: 'responseDate', label: 'Response due date', type: 'date' },
      { name: 'noticeIssue', label: 'Briefly describe the notice', type: 'textarea', required: true }
    ]
  },
  {
    id: 'website',
    title: 'Website',
    icon: Globe2,
    services: ['Website Development', 'Logo Making', 'Purchase Domain', 'Hosting', 'Banner Making'],
    fields: [
      ...contactFields,
      { name: 'brandName', label: 'Business or brand name', required: true },
      { name: 'domain', label: 'Domain name (if available)' },
      { name: 'requirements', label: 'Project requirements', type: 'textarea', required: true },
      { name: 'reference', label: 'Style or reference links' }
    ]
  },
  {
    id: 'insurance',
    title: 'Insurance',
    icon: ShieldCheck,
    services: ['Car Insurance', 'Bike Insurance', 'Truck Insurance', 'Miscellaneous Vehicle Insurance', 'Other Vehicle Insurance'],
    fields: [
      ...contactFields,
      { name: 'vehicleNumber', label: 'Vehicle registration number', required: true },
      { name: 'vehicleModel', label: 'Vehicle make and model' },
      { name: 'manufactureYear', label: 'Year of manufacture' },
      { name: 'policyExpiry', label: 'Current policy expiry date', type: 'date' }
    ]
  },
  {
    id: 'bank-loans',
    title: 'Bank Loans',
    icon: Landmark,
    services: ['Current Account File Making', 'Mudra Loan File Making', 'Mudra Loan Online Request'],
    fields: [
      ...contactFields,
      { name: 'businessName', label: 'Business name', required: true },
      { name: 'businessType', label: 'Business type' },
      { name: 'loanAmount', label: 'Requested loan amount (if applicable)' },
      { name: 'requestDetails', label: 'Purpose and other details', type: 'textarea', required: true }
    ]
  }
];

export const MenuView: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<{ category: ServiceCategory; title: string } | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const openService = (category: ServiceCategory, title: string) => {
    setSelectedService({ category, title });
    setValues({});
    setIsSubmitted(false);
  };

  const returnToMenu = () => {
    setSelectedService(null);
    setValues({});
    setIsSubmitted(false);
  };

  if (selectedService) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-5 animate-fadeIn pb-24">
        <button
          type="button"
          onClick={returnToMenu}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 py-1.5 px-3 rounded-lg hover:bg-blue-50 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to services</span>
        </button>

        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-500">{selectedService.category.title}</p>
          <h1 className="text-2xl font-black text-black">{selectedService.title}</h1>
        </div>

        {isSubmitted ? (
          <div role="status" className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-900">
            Your details are entered in this form preview. No service request has been submitted.
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setIsSubmitted(true);
            }}
            className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedService.category.fields.map((field) => (
                <label key={field.name} className={`block text-xs font-semibold text-slate-700 ${field.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
                  <span className="block mb-1">{field.label}{field.required && <span className="text-rose-600"> *</span>}</span>
                  {field.type === 'textarea' ? (
                    <textarea
                      required={field.required}
                      value={values[field.name] || ''}
                      onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                      rows={3}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-normal text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      required={field.required}
                      value={values[field.name] || ''}
                      onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-normal text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="flex justify-end">
              <button type="submit" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg px-4 py-2.5">
                <span>Review details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-5 animate-fadeIn pb-24">
      <div className="mb-4">
        <h1 className="text-2xl font-black text-black">Services</h1>
      </div>

      <div className="space-y-3">
        {serviceCategories.map((category) => {
          const Icon = category.icon;
          const isExpanded = expandedCategory === category.id;
          return (
            <section key={category.id} className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
              <button
                type="button"
                aria-expanded={isExpanded}
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-slate-50"
              >
                <span className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-slate-900">{category.title}</span>
                    <span className="block text-xs text-slate-500">{category.services.length} services</span>
                  </span>
                </span>
                {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-500" /> : <ChevronRight className="w-5 h-5 text-slate-500" />}
              </button>
              {isExpanded && (
                <div className="border-t border-slate-200 divide-y divide-slate-100">
                  {category.services.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => openService(category, service)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left text-sm text-slate-800 hover:bg-blue-50"
                    >
                      <span>{service}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};