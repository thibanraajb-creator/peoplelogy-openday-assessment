import React, { createContext, useContext, useState, useCallback } from 'react'

const AssessmentContext = createContext(null)

function assignCluster(roleLevel, primaryFunction) {
  const leaderRoles = ['C-Suite / Board (CEO, COO, CFO, CTO)', 'Director / VP']
  if (leaderRoles.includes(roleLevel)) return 'A'

  const map = {
    'Strategy & Leadership': 'A',
    'Human Resources & People': 'A',
    'Finance & Accounting': 'A',
    'Sales & Business Development': 'B',
    'Operations & Process': 'B',
    'Marketing & Branding': 'C',
    'Technology & Digital': 'D',
    'Product & Innovation': 'D',
    'Learning & Development': 'E',
    'Others': 'B',
  }
  return map[primaryFunction] || 'B'
}

const initialState = {
  path: null,
  intake: {
    firstName: '',
    organisation: '',
    industry: '',
    orgSize: '',
    roleLevel: '',
    primaryFunction: '',
    email: '',
    consent: false,
    cluster: 'A',
  },
  orgResponses: Array(25).fill(null),
  individualResponses: Array(15).fill(null),
  orgResponseId: null,
  individualResponseId: null,
  orgScores: null,
  individualScores: null,
  qualitativeResponses: { q1: null, q2: null, q3: null, q4: null, q5: null, q6: null, q7: null, q8: null },
  qualitativeScores: null,
  qualitativeResponseId: null,
}

export function AssessmentProvider({ children }) {
  const [assessmentData, setAssessmentData] = useState(initialState)

  const setPath = useCallback((path) => {
    setAssessmentData(prev => ({ ...prev, path }))
  }, [])

  const updateIntake = useCallback((data) => {
    setAssessmentData(prev => {
      const updatedIntake = { ...prev.intake, ...data }
      if ('roleLevel' in data || 'primaryFunction' in data) {
        updatedIntake.cluster = assignCluster(updatedIntake.roleLevel, updatedIntake.primaryFunction)
      }
      return { ...prev, intake: updatedIntake }
    })
  }, [])

  const updateOrgResponse = useCallback((index, value) => {
    setAssessmentData(prev => {
      const updated = [...prev.orgResponses]
      updated[index] = value
      return { ...prev, orgResponses: updated }
    })
  }, [])

  const updateIndividualResponse = useCallback((index, value) => {
    setAssessmentData(prev => {
      const updated = [...prev.individualResponses]
      updated[index] = value
      return { ...prev, individualResponses: updated }
    })
  }, [])

  const setOrgScores = useCallback((scores) => {
    setAssessmentData(prev => ({ ...prev, orgScores: scores }))
  }, [])

  const setIndividualScores = useCallback((scores) => {
    setAssessmentData(prev => ({ ...prev, individualScores: scores }))
  }, [])

  const setOrgResponseId = useCallback((id) => {
    setAssessmentData(prev => ({ ...prev, orgResponseId: id }))
  }, [])

  const setIndividualResponseId = useCallback((id) => {
    setAssessmentData(prev => ({ ...prev, individualResponseId: id }))
  }, [])

  const updateQualitativeResponse = useCallback((key, value) => {
    setAssessmentData(prev => ({
      ...prev,
      qualitativeResponses: { ...prev.qualitativeResponses, [key]: value },
    }))
  }, [])

  const setQualitativeScores = useCallback((scores) => {
    setAssessmentData(prev => ({ ...prev, qualitativeScores: scores }))
  }, [])

  const setQualitativeResponseId = useCallback((id) => {
    setAssessmentData(prev => ({ ...prev, qualitativeResponseId: id }))
  }, [])

  const resetAssessment = useCallback(() => {
    setAssessmentData(initialState)
  }, [])

  return (
    <AssessmentContext.Provider value={{
      assessmentData,
      setPath,
      updateIntake,
      updateOrgResponse,
      updateIndividualResponse,
      setOrgScores,
      setIndividualScores,
      setOrgResponseId,
      setIndividualResponseId,
      updateQualitativeResponse,
      setQualitativeScores,
      setQualitativeResponseId,
      resetAssessment,
    }}>
      {children}
    </AssessmentContext.Provider>
  )
}

export function useAssessment() {
  const context = useContext(AssessmentContext)
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider')
  }
  return context
}
