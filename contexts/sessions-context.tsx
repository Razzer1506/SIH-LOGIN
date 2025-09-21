"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './auth-context'

interface Session {
  id: string
  type: string
  practitioner: string
  practitionerAvatar?: string
  date: string
  time: string
  duration: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  location: string
  phone?: string
  notes?: string
  price: string
  rating?: number
  feedback?: string
}

interface SessionsContextType {
  upcomingSessions: Session[]
  pastSessions: Session[]
  loading: boolean
  error: string | null
  addSession: (session: Omit<Session, 'id'>) => void
  updateSession: (id: string, updates: Partial<Session>) => void
  loadSessions: () => Promise<void>
  refreshSessions: () => Promise<void>
}

const SessionsContext = createContext<SessionsContextType | undefined>(undefined)

export function SessionsProvider({ children }: { children: ReactNode }) {
  const { user, token } = useAuth()
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
  const [pastSessions, setPastSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load sessions from API or localStorage
  const loadSessions = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      // Try to load from API first
      if (token) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/appointments`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          if (response.ok) {
            const appointments = await response.json()
            
            // Convert appointments to sessions format
            const sessions: Session[] = appointments.map((apt: any) => ({
              id: apt._id,
              type: apt.treatment,
              practitioner: apt.practitioner?.displayName || 'Unknown Practitioner',
              practitionerAvatar: apt.practitioner?.avatar || '/placeholder.svg',
              date: new Date(apt.date).toISOString().split('T')[0],
              time: apt.time,
              duration: `${apt.duration} min`,
              status: apt.status || 'confirmed',
              location: apt.location || 'Wellness Center',
              phone: apt.practitioner?.phone || '+91 98765 43210',
              notes: apt.notes || '',
              price: `₹${(apt.cost * 80).toLocaleString()}`, // Convert USD to INR
              rating: apt.rating,
              feedback: apt.feedback
            }))

            // Separate upcoming and past sessions
            const now = new Date()
            const upcoming = sessions.filter(session => {
              const sessionDate = new Date(`${session.date} ${session.time}`)
              return sessionDate >= now && session.status !== 'completed' && session.status !== 'cancelled'
            })
            const past = sessions.filter(session => {
              const sessionDate = new Date(`${session.date} ${session.time}`)
              return sessionDate < now || session.status === 'completed' || session.status === 'cancelled'
            })

            setUpcomingSessions(upcoming)
            setPastSessions(past)
            return
          }
        } catch (apiError) {
          console.log('API not available, loading from localStorage:', apiError)
        }
      }

      // Fallback to localStorage
      const storedSessions = localStorage.getItem(`sessions_${user.id}`)
      if (storedSessions) {
        const sessions: Session[] = JSON.parse(storedSessions)
        
        // Separate upcoming and past sessions
        const now = new Date()
        const upcoming = sessions.filter(session => {
          const sessionDate = new Date(`${session.date} ${session.time}`)
          return sessionDate >= now && session.status !== 'completed' && session.status !== 'cancelled'
        })
        const past = sessions.filter(session => {
          const sessionDate = new Date(`${session.date} ${session.time}`)
          return sessionDate < now || session.status === 'completed' || session.status === 'cancelled'
        })

        setUpcomingSessions(upcoming)
        setPastSessions(past)
      }
    } catch (err) {
      console.error('Error loading sessions:', err)
      setError(err instanceof Error ? err.message : 'Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  // Add a new session
  const addSession = (session: Omit<Session, 'id'>) => {
    console.log('SessionsContext: Adding session:', session)
    const newSession: Session = {
      ...session,
      id: Date.now().toString() // Temporary ID
    }
    
    console.log('SessionsContext: New session with ID:', newSession)
    
    // Add to upcoming sessions
    setUpcomingSessions(prev => {
      const updated = [newSession, ...prev]
      console.log('SessionsContext: Updated upcoming sessions:', updated)
      // Save to localStorage
      if (user) {
        const allSessions = [...updated, ...pastSessions]
        localStorage.setItem(`sessions_${user.id}`, JSON.stringify(allSessions))
        console.log('SessionsContext: Saved to localStorage:', allSessions)
      }
      return updated
    })
  }

  // Update an existing session
  const updateSession = (id: string, updates: Partial<Session>) => {
    setUpcomingSessions(prev => {
      const updated = prev.map(session => 
        session.id === id ? { ...session, ...updates } : session
      )
      // Save to localStorage
      if (user) {
        const allSessions = [...updated, ...pastSessions]
        localStorage.setItem(`sessions_${user.id}`, JSON.stringify(allSessions))
      }
      return updated
    })
    setPastSessions(prev => {
      const updated = prev.map(session => 
        session.id === id ? { ...session, ...updates } : session
      )
      // Save to localStorage
      if (user) {
        const allSessions = [...upcomingSessions, ...updated]
        localStorage.setItem(`sessions_${user.id}`, JSON.stringify(allSessions))
      }
      return updated
    })
  }

  // Refresh sessions
  const refreshSessions = async () => {
    await loadSessions()
  }

  // Load sessions when user changes
  useEffect(() => {
    if (user && token) {
      loadSessions()
    }
  }, [user, token])

  const value: SessionsContextType = {
    upcomingSessions,
    pastSessions,
    loading,
    error,
    addSession,
    updateSession,
    loadSessions,
    refreshSessions
  }

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  )
}

export function useSessions() {
  const context = useContext(SessionsContext)
  if (context === undefined) {
    throw new Error('useSessions must be used within a SessionsProvider')
  }
  return context
}
