import React, { createContext, useContext, useState } from 'react'

const AssessmentContext = createContext(null)

export function AssessmentProvider({ children }) {
  const [assessmentData, setAssessmentData] = useState({
    // Path: 'org' | 'individual' | 'full'
    path: null,

    // Intake form data
    intake: {
      firstName: '',
      organisation: '',
      industry: '',
      orgSize: '',
      roleLevel: '',
      primaryFunction: '',
      email: '',
      consent: false,
      cluster: null,
    },

    // Layer 1 org survey responses
    orgResponses: {
      // pillar1: [q1, q2, q3, q4, q5]
      pillar1: [null, null, null, null, null],
      pillar2: [null, null, null, null, null],
      pillar3: [null, null, null, null, null],
      pillar4: [null, null, null, null, null],
      pillar5: [null, null, null, null, null],
    },

    // Layer 1 computed scores
    orgScores: null,

    // Layer 2 individual responses
    individualResponses: Array(10).fill(null),

    // Layer 2 computed scores
    individualScores: null,

    // Supabase response IDs
    orgResponseId: null,
    individualResponseId: null,
  })

  const updateIntake = (data) => {
    setAssessmentData(prev => ({
      ...prev,
      intake: { ...prev.intake, ...data },
    }))
  }

  const setPath = (path) => {
    setAssessmentData(prev => ({ ...prev, path }))
  }

  const updateOrgResponses = (pillar, questionIndex, score) => {
    setAssessmentData(prev => {
      const updated = { ...prev.orgResponses }
      updated[`pillar${pillar}`] = [...updated[`pillar${pillar}`]]
      updated[`pillar${pillar}`][questionIndex] = score
      return { ...prev, orgResponses: updated }
    })
  }

  const setOrgScores = (scores) => {
    setAssessmentData(prev => ({ ...prev, orgScores: scores }))
  }

  const updateIndividualResponse = (index, value) => {
    setAssessmentData(prev => {
      const updated = [...prev.individualResponses]
      updated[index] = value
      return { ...prev, individualResponses: updated }
    })
  }

  const setIndividualScores = (scores) => {
    setAssessmentData(prev => ({ ...prev, individualScores: scores }))
  }

  const setOrgResponseId = (id) => {
    setAssessmentData(prev => ({ ...prev, orgResponseId: id }))
  }

  const setIndividualResponseId = (id) => {
    setAssessmentData(prev => ({ ...prev, individualResponseId: id }))
  }

  return (
    <AssessmentContext.Provider value={{
      assessmentData,
      setPath,
      updateIntake,
      updateOrgResponses,
      setOrgScores,
      updateIndividualResponse,
      setIndividualScores,
      setOrgResponseId,
      setIndividualResponseId,
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
