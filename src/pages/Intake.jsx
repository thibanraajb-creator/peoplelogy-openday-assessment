import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAssessment } from '../context/AssessmentContext'
import { assignCluster } from '../data/individualQuestions'
import Logo from '../components/Logo'

const INDUSTRIES = [
  'Agriculture & Food', 'Automotive', 'Construction & Property',
  'Education & Training', 'Energy & Utilities', 'Financial Services & Banking',
  'Government & Public Sector', 'Healthcare & Life Sciences',
  'Hospitality & Tourism', 'Insurance', 'Logistics & Supply Chain',
  'Manufacturing & Engineering', 'Media & Communications',
  'Professional Services', 'Retail & Consumer', 'Technology & Digital',
  'Telecommunications', 'Others',
]

const ORG_SIZES = [
  '1–50 employees (SME)',
  '51–200 employees (Growing)',
  '201–500 employees (Mid-size)',
  '501–1,000 employees (Large)',
  '1,000+ employees (Enterprise)',
]

const ROLE_LEVELS = [
  'C-Suite / Board (CEO, COO, CFO, CTO)',
  'Director / VP',
  'Senior Manager',
  'Manager',
  'Executive / Officer',
  'Individual Contributor / Analyst',
  'Others',
]

const PRIMARY_FUNCTIONS = [
  'Strategy & Leadership',
  'Sales & Business Development',
  'Marketing & Branding',
  'Technology & Digital',
  'Operations & Process',
  'Human Resources & People',
  'Finance & Accounting',
  'Learning & Development',
  'Product & Innovation',
  'Others',
]

export default function Intake() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setPath, updateIntake } = useAssessment()

  const path = location.state?.path || 'individual'

  const pathLabels = {
    org: "My Organisation's Readiness",
    individual: 'My Personal AI Capability',
    full: 'Full AI Readiness Assessment',
  }

  const [form, setForm] = useState({
    firstName: '',
    organisation: '',
    industry: '',
    orgSize: '',
    roleLevel: '',
    primaryFunction: '',
    email: '',
    consent: false,
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.organisation.trim()) e.organisation = 'Organisation name is required'
    if (!form.industry) e.industry = 'Please select an industry'
    if (!form.orgSize) e.orgSize = 'Please select organisation size'
    if (!form.roleLevel) e.roleLevel = 'Please select your role level'
    if (!form.primaryFunction) e.primaryFunction = 'Please select your primary function'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Please enter a valid email address'
    }
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      // Scroll to first error
      const firstErrorKey = Object.keys(errs)[0]
      document.getElementById(firstErrorKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)

    const cluster = assignCluster(form.roleLevel, form.primaryFunction)
    const intakeData = { ...form, cluster }

    setPath(path)
    updateIntake(intakeData)

    if (path === 'org') {
      navigate('/survey/org')
    } else if (path === 'individual') {
      navigate('/survey/individual')
    } else {
      navigate('/survey/org')
    }
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1B3A5C] px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Logo />
          <span className="text-white/60 text-sm">{pathLabels[path]}</span>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1B3A5C] mb-2">Tell us about yourself</h1>
          <p className="text-gray-500 text-sm">This helps us personalise your assessment and results.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-1.5">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              value={form.firstName}
              onChange={e => handleChange('firstName', e.target.value)}
              placeholder="Enter your first name"
              className={`input-field ${errors.firstName ? 'border-red-400 focus:ring-red-300' : ''}`}
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>

          {/* Organisation */}
          <div>
            <label htmlFor="organisation" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Organisation Name <span className="text-red-500">*</span>
            </label>
            <input
              id="organisation"
              type="text"
              value={form.organisation}
              onChange={e => handleChange('organisation', e.target.value)}
              placeholder="Enter your organisation name"
              className={`input-field ${errors.organisation ? 'border-red-400 focus:ring-red-300' : ''}`}
            />
            {errors.organisation && <p className="text-red-500 text-xs mt-1">{errors.organisation}</p>}
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Industry <span className="text-red-500">*</span>
            </label>
            <select
              id="industry"
              value={form.industry}
              onChange={e => handleChange('industry', e.target.value)}
              className={`select-field ${errors.industry ? 'border-red-400 focus:ring-red-300' : ''}`}
            >
              <option value="">Select your industry</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
          </div>

          {/* Org Size */}
          <div>
            <label htmlFor="orgSize" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Organisation Size <span className="text-red-500">*</span>
            </label>
            <select
              id="orgSize"
              value={form.orgSize}
              onChange={e => handleChange('orgSize', e.target.value)}
              className={`select-field ${errors.orgSize ? 'border-red-400 focus:ring-red-300' : ''}`}
            >
              <option value="">Select organisation size</option>
              {ORG_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.orgSize && <p className="text-red-500 text-xs mt-1">{errors.orgSize}</p>}
          </div>

          {/* Role Level */}
          <div>
            <label htmlFor="roleLevel" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Role Level <span className="text-red-500">*</span>
            </label>
            <select
              id="roleLevel"
              value={form.roleLevel}
              onChange={e => handleChange('roleLevel', e.target.value)}
              className={`select-field ${errors.roleLevel ? 'border-red-400 focus:ring-red-300' : ''}`}
            >
              <option value="">Select your role level</option>
              {ROLE_LEVELS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            {errors.roleLevel && <p className="text-red-500 text-xs mt-1">{errors.roleLevel}</p>}
          </div>

          {/* Primary Function */}
          <div>
            <label htmlFor="primaryFunction" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Primary Function <span className="text-red-500">*</span>
            </label>
            <select
              id="primaryFunction"
              value={form.primaryFunction}
              onChange={e => handleChange('primaryFunction', e.target.value)}
              className={`select-field ${errors.primaryFunction ? 'border-red-400 focus:ring-red-300' : ''}`}
            >
              <option value="">Select your primary function</option>
              {PRIMARY_FUNCTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            {errors.primaryFunction && <p className="text-red-500 text-xs mt-1">{errors.primaryFunction}</p>}
          </div>

          {/* Email */}
          <div className="bg-[#E6FAF9] rounded-xl p-5 border border-[#00ADA9]/20">
            <label htmlFor="email" className="block text-sm font-semibold text-[#1B3A5C] mb-1">
              Get your full AI Readiness Report delivered to your inbox
              <span className="text-gray-500 font-normal ml-1">(optional)</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Your email is kept secure and used only to send your report. We never share your data.
            </p>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="your@email.com"
              className={`input-field bg-white ${errors.email ? 'border-red-400' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            <p className="text-xs text-gray-400 mt-2">
              All personal data is handled in accordance with Malaysia's Personal Data Protection Act (PDPA) 2010.
            </p>
          </div>

          {/* Consent */}
          <div className="flex items-start gap-3">
            <input
              id="consent"
              type="checkbox"
              checked={form.consent}
              onChange={e => handleChange('consent', e.target.checked)}
              className="mt-1 w-4 h-4 accent-[#00ADA9] cursor-pointer"
            />
            <label htmlFor="consent" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
              I consent to PEOPLElogy contacting me about AI transformation services
            </label>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#00ADA9] hover:bg-[#008a87] disabled:opacity-60 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-200 text-base"
            >
              {submitting ? 'Starting...' : 'Start Assessment →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
