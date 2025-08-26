// Document requirements for different scholarship types
export interface DocumentRequirement {
  id: string
  name: string
  description: string
  required: boolean
  acceptedFormats: string[]
}

export const documentRequirementsByType: Record<string, DocumentRequirement[]> = {
  undergraduate: [
    {
      id: 'transcript',
      name: 'Official Transcript',
      description: 'High school or college transcript with grades',
      required: true,
      acceptedFormats: ['PDF']
    },
    {
      id: 'personal-statement',
      name: 'Personal Statement',
      description: 'Essay about your goals and motivations (if already written)',
      required: false,
      acceptedFormats: ['PDF']
    },
    {
      id: 'recommendation-letter',
      name: 'Recommendation Letters',
      description: 'Letters from teachers, counselors, or mentors',
      required: true,
      acceptedFormats: ['PDF']
    },
    {
      id: 'financial-documents',
      name: 'Financial Documents',
      description: 'FAFSA, tax returns, or income statements',
      required: false,
      acceptedFormats: ['PDF']
    },
    {
      id: 'extracurricular-resume',
      name: 'Activities Resume',
      description: 'List of extracurricular activities, volunteer work, jobs',
      required: true,
      acceptedFormats: ['PDF']
    }
  ],
  
  graduate: [
    {
      id: 'transcript',
      name: 'Official Transcripts',
      description: 'Undergraduate and graduate transcripts',
      required: true,
      acceptedFormats: ['PDF']
    },
    {
      id: 'cv-resume',
      name: 'CV/Resume',
      description: 'Academic or professional curriculum vitae',
      required: true,
      acceptedFormats: ['PDF']
    },
    {
      id: 'statement-of-purpose',
      name: 'Statement of Purpose',
      description: 'Research interests and academic goals (if already written)',
      required: false,
      acceptedFormats: ['PDF']
    },
    {
      id: 'recommendation-letters',
      name: 'Recommendation Letters',
      description: 'Academic or professional reference letters',
      required: true,
      acceptedFormats: ['PDF']
    },
    {
      id: 'research-proposal',
      name: 'Research Proposal',
      description: 'Detailed research plan (if applicable)',
      required: false,
      acceptedFormats: ['PDF']
    },
    {
      id: 'publications',
      name: 'Publications/Portfolio',
      description: 'Academic papers, thesis, or professional portfolio',
      required: false,
      acceptedFormats: ['PDF']
    },
    {
      id: 'test-scores',
      name: 'Test Scores',
      description: 'GRE, GMAT, TOEFL, IELTS score reports',
      required: false,
      acceptedFormats: ['PDF']
    }
  ],
  
  phd: [
    {
      id: 'transcript',
      name: 'Official Transcripts',
      description: 'All undergraduate and graduate transcripts',
      required: true,
      acceptedFormats: ['PDF']
    },
    {
      id: 'cv',
      name: 'Academic CV',
      description: 'Comprehensive academic curriculum vitae',
      required: true,
      acceptedFormats: ['PDF']
    },
    {
      id: 'research-statement',
      name: 'Research Statement',
      description: 'Detailed research interests and methodology (if written)',
      required: false,
      acceptedFormats: ['PDF']
    },
    {
      id: 'dissertation-proposal',
      name: 'Dissertation Proposal',
      description: 'PhD research proposal or thesis outline',
      required: true,
      acceptedFormats: ['PDF']
    },
    {
      id: 'recommendation-letters',
      name: 'Academic References',
      description: 'Letters from professors and research supervisors',
      required: true,
      acceptedFormats: ['PDF']
    },
    {
      id: 'publications-list',
      name: 'Publications & Research',
      description: 'Published papers, conference presentations, research work',
      required: false,
      acceptedFormats: ['PDF']
    },
    {
      id: 'test-scores',
      name: 'Standardized Test Scores',
      description: 'GRE, subject GRE, language proficiency scores',
      required: false,
      acceptedFormats: ['PDF']
    },
    {
      id: 'writing-sample',
      name: 'Writing Sample',
      description: 'Academic writing sample or thesis chapter',
      required: false,
      acceptedFormats: ['PDF']
    }
  ],
  
  research: [
    {
      id: 'cv',
      name: 'Research CV',
      description: 'Academic CV emphasizing research experience',
      required: true,
      acceptedFormats: ['PDF']
    },
    {
      id: 'research-proposal',
      name: 'Research Proposal',
      description: 'Detailed research methodology and timeline',
      required: true,
      acceptedFormats: ['PDF']
    },
    {
      id: 'publications',
      name: 'Research Publications',
      description: 'Published papers and conference presentations',
      required: false,
      acceptedFormats: ['PDF']
    },
    {
      id: 'recommendation-letters',
      name: 'Professional References',
      description: 'Letters from research supervisors and collaborators',
      required: true,
      acceptedFormats: ['PDF']
    },
    {
      id: 'budget-plan',
      name: 'Budget & Timeline',
      description: 'Research budget breakdown and project timeline',
      required: false,
      acceptedFormats: ['PDF']
    }
  ],
  
  'study-abroad': [
    {
      id: 'transcript',
      name: 'Academic Transcript',
      description: 'Official transcript from current institution',
      required: true,
      acceptedFormats: ['PDF']
    },
    {
      id: 'passport',
      name: 'Passport Copy',
      description: 'Valid passport biographical page',
      required: true,
      acceptedFormats: ['PDF']
    },
    {
      id: 'language-proficiency',
      name: 'Language Test Scores',
      description: 'TOEFL, IELTS, or other language certification',
      required: true,
      acceptedFormats: ['PDF']
    },
    {
      id: 'motivation-letter',
      name: 'Motivation Letter',
      description: 'Letter explaining study abroad goals (if written)',
      required: false,
      acceptedFormats: ['PDF']
    },
    {
      id: 'financial-proof',
      name: 'Financial Documentation',
      description: 'Bank statements or sponsorship letters',
      required: true,
      acceptedFormats: ['PDF']
    },
    {
      id: 'recommendation-letter',
      name: 'Academic References',
      description: 'Letters from professors or academic advisors',
      required: true,
      acceptedFormats: ['PDF']
    }
  ],
  
  internship: [
    {
      id: 'resume',
      name: 'Resume/CV',
      description: 'Professional resume highlighting relevant experience',
      required: true,
      acceptedFormats: ['PDF']
    },
    {
      id: 'cover-letter',
      name: 'Cover Letter',
      description: 'Personalized cover letter for the program (if written)',
      required: false,
      acceptedFormats: ['PDF']
    },
    {
      id: 'transcript',
      name: 'Academic Transcript',
      description: 'Current academic transcript',
      required: true,
      acceptedFormats: ['PDF']
    },
    {
      id: 'portfolio',
      name: 'Portfolio/Work Samples',
      description: 'Relevant work samples or project portfolio',
      required: false,
      acceptedFormats: ['PDF']
    },
    {
      id: 'recommendation-letter',
      name: 'Professional References',
      description: 'Letters from professors, employers, or mentors',
      required: true,
      acceptedFormats: ['PDF']
    }
  ],
  
  other: [
    {
      id: 'application-form',
      name: 'Application Documents',
      description: 'Any existing application materials',
      required: false,
      acceptedFormats: ['PDF']
    },
    {
      id: 'supporting-documents',
      name: 'Supporting Documents',
      description: 'Any additional documents relevant to your application',
      required: false,
      acceptedFormats: ['PDF']
    }
  ]
}

export const getDocumentRequirements = (scholarshipType: string): DocumentRequirement[] => {
  return documentRequirementsByType[scholarshipType] || documentRequirementsByType.other
}