'use client'

import { supabase } from './supabase'
import { UserRole } from './supabase'

export const signUp = async (email: string, password: string, role: UserRole, additionalData?: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        ...additionalData
      }
    }
  })
  
  if (error) throw error
  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
    
  if (error) throw error
  return data
}