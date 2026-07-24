import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAssessment } from '../context/AssessmentContext'
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
  '1-50 employees (SME)',
  '51-200 employees (Growing)',
  '201-500 employees (Mid-size)',
  '501-1,000 employees (Large)',
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

const PATH_BADGE = {
  org:        'My Organisation',
  individual: 'My Capability',
  full:       'Full Assessment',
  safety:     'AI Safety & Digital Trust',
}

const SUBMIT_LABEL = {
  org:        'Start Organisation Assessment',
  individual: 'Start Personal Assessment',
  full:       'Start Full Assessment',
  safety:     'Start Safety Assessment',
}

const INPUT_CLS =
  'border border-gray-200 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-[#00ADA9] focus:border-transparent outline-none text-sm bg-white'

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function Intake() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const { setPath, updateIntake } = useAssessment()

  const path = location.state?.path
  if (!path) {
    navigate('/', { replace: true })
    return null
  }

  const [form, setForm] = useState({
    firstName: '', organisation: '', industry: '', orgSize: '',
    roleLevel: '', primaryFunction: '', email: '', consent: false,
  })
  const [errors, setErrors]     = useState({})
  const [submitting, setSubmitting] = useState(false)

  const change = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  const requiredFilled =
    form.firstName.trim() &&
    form.organisation.trim() &&
    form.industry &&
    form.orgSize &&
    form.roleLevel &&
    form.primaryFunction

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.firstName.trim())    errs.firstName       = 'First name is required'
    if (!form.organisation.trim()) errs.organisation    = 'Organisation name is required'
    if (!form.industry)            errs.industry        = 'Please select an industry'
    if (!form.orgSize)             errs.orgSize         = 'Please select organisation size'
    if (!form.roleLevel)           errs.roleLevel       = 'Please select your role level'
    if (!form.primaryFunction)     errs.primaryFunction = 'Please select your primary function'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Please enter a valid email address'

    if (Object.keys(errs).length) {
      setErrors(errs)
      const first = Object.keys(errs)[0]
      document.getElementById(first)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)
    setPath(path)
    updateIntake(form)   // cluster auto-assigned inside context

    if (path === 'individual') navigate('/survey/qualitative')
    else if (path === 'safety') navigate('/survey/safety')
    else navigate('/survey/org')
  }

  return (
    <div className="min-h-screen bg-[#1B3A5C]">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-2xl mx-auto">
        <Logo height={36} />
        <span className="bg-[#00ADA9]/20 border border-[#00ADA9]/40 text-[#00ADA9] text-xs font-bold px-3 py-1.5 rounded-full">
          {PATH_BADGE[path]}
        </span>
      </nav>

      {/* Form card */}
      <div className="max-w-lg mx-auto mt-8 px-6 pb-16">
        <div className="bg-white rounded-2xl p-8 shadow-lg">

          <h1 className="text-[#1B3A5C] font-bold text-2xl mb-2">Tell us about yourself</h1>
          <p className="text-gray-500 text-sm mb-6">
            Semi-anonymous. Only your first name and organisation are shown on results.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* First name */}
            <Field label="First name" required error={errors.firstName}>
              <input
                id="firstName"
                type="text"
                value={form.firstName}
                onChange={e => change('firstName', e.target.value)}
                placeholder="Your first name"
                className={INPUT_CLS}
              />
            </Field>

            {/* Organisation */}
            <Field label="Organisation" required error={errors.organisation}>
              <input
                id="organisation"
                type="text"
                value={form.organisation}
                onChange={e => change('organisation', e.target.value)}
                placeholder="Your company or organisation name"
                className={INPUT_CLS}
              />
            </Field>

            {/* Industry */}
            <Field label="Industry" required error={errors.industry}>
              <select
                id="industry"
                value={form.industry}
                onChange={e => change('industry', e.target.value)}
                className={INPUT_CLS}
              >
                <option value="">Select your industry</option>
                {INDUSTRIES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>

            {/* Org size */}
            <Field label="Organisation size" required error={errors.orgSize}>
              <select
                id="orgSize"
                value={form.orgSize}
                onChange={e => change('orgSize', e.target.value)}
                className={INPUT_CLS}
              >
                <option value="">Select size</option>
                {ORG_SIZES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>

            {/* Role level */}
            <Field label="Your role level" required error={errors.roleLevel}>
              <select
                id="roleLevel"
                value={form.roleLevel}
                onChange={e => change('roleLevel', e.target.value)}
                className={INPUT_CLS}
              >
                <option value="">Select role level</option>
                {ROLE_LEVELS.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>

            {/* Primary function */}
            <Field label="Your primary function" required error={errors.primaryFunction}>
              <select
                id="primaryFunction"
                value={form.primaryFunction}
                onChange={e => change('primaryFunction', e.target.value)}
                className={INPUT_CLS}
              >
                <option value="">Select function</option>
                {PRIMARY_FUNCTIONS.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>

            {/* Email (optional) */}
            <Field label="Email address" error={errors.email}>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={e => change('email', e.target.value)}
                placeholder="your@email.com"
                className={INPUT_CLS}
              />
              <p className="text-gray-400 text-xs mt-1.5">
                Your email is kept secure and used only to send your report. We never share your data.
              </p>
              <p className="text-gray-400 text-xs mt-1">
                All personal data is handled in accordance with Malaysia's Personal Data Protection Act (PDPA) 2010.
              </p>
            </Field>

            {/* Consent (optional) */}
            <div className="flex items-start gap-3 pt-1">
              <input
                id="consent"
                type="checkbox"
                checked={form.consent}
                onChange={e => change('consent', e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#00ADA9] cursor-pointer flex-shrink-0"
              />
              <label htmlFor="consent" className="text-gray-500 text-sm cursor-pointer leading-snug">
                I consent to PEOPLElogy contacting me about AI transformation services.
              </label>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!requiredFilled || submitting}
                className="w-full bg-[#00ADA9] hover:bg-[#008a87] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors duration-200 text-base"
              >
                {submitting ? 'Starting…' : SUBMIT_LABEL[path]}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
