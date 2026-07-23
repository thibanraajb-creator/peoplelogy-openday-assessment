import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AssessmentProvider } from './context/AssessmentContext'
import Landing from './pages/Landing'
import Intake from './pages/Intake'
import SurveyOrg from './pages/SurveyOrg'
import SurveyIndividual from './pages/SurveyIndividual'
import Transition from './pages/Transition'
import Results from './pages/Results'
import Dashboard from './pages/Dashboard'
import Facilitator from './pages/Facilitator'
import SurveyQualitative from './pages/SurveyQualitative'
import SurveySafety from './pages/SurveySafety'
import ResultsSafety from './pages/ResultsSafety'
import DashboardSafety from './pages/DashboardSafety'

export default function App() {
  return (
    <BrowserRouter>
      <AssessmentProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/intake" element={<Intake />} />
          <Route path="/survey/org" element={<SurveyOrg />} />
          <Route path="/survey/individual" element={<SurveyIndividual />} />
          <Route path="/survey/qualitative" element={<SurveyQualitative />} />
          <Route path="/survey/safety" element={<SurveySafety />} />
          <Route path="/transition" element={<Transition />} />
          <Route path="/results" element={<Results />} />
          <Route path="/results/safety" element={<ResultsSafety />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/safety" element={<DashboardSafety />} />
          <Route path="/facilitator-jb2026" element={<Facilitator />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AssessmentProvider>
    </BrowserRouter>
  )
}
