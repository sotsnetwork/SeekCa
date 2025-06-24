'use client'

import { supabase } from './supabase'

export interface Conversation {
  id: string
  job_id: string
  hirer_id: string
  professional_id: string
  last_message_at: string
  created_at: string
  updated_at: string
  job?: {
    id: string
    title: string
  }
  hirer?: {
    id: string
    first_name: string
    last_name: string
    company_name: string
    avatar_url: string
  }
  professional?: {
    id: string
    first_name: string
    last_name: string
    avatar_url: string
  }
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'file' | 'system'
  file_url?: string
  file_name?: string
  is_read: boolean
  created_at: string
  sender?: {
    first_name: string
    last_name: string
    avatar_url: string
  }
}

export const messagingService = {
  async getConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        job:jobs(id, title),
        hirer:profiles!conversations_hirer_id_fkey(
          id, first_name, last_name, company_name, avatar_url
        ),
        professional:profiles!conversations_professional_id_fkey(
          id, first_name, last_name, avatar_url
        )
      `)
      .or(`hirer_id.eq.${userId},professional_id.eq.${userId}`)
      .order('last_message_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles(first_name, last_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  },

  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    messageType: 'text' | 'file' | 'system' = 'text',
    fileUrl?: string,
    fileName?: string
  ): Promise<Message> {
    const messageData = {
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      message_type: messageType,
      file_url: fileUrl,
      file_name: fileName,
      is_read: false
    }

    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .eq('is_read', false)

    if (error) throw error
  },

  async createConversation(
    jobId: string,
    hirerId: string,
    professionalId: string
  ): Promise<Conversation> {
    // Check if conversation already exists
    const { data: existingConv, error: checkError } = await supabase
      .from('conversations')
      .select('id')
      .eq('job_id', jobId)
      .eq('hirer_id', hirerId)
      .eq('professional_id', professionalId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') throw checkError
    
    if (existingConv) {
      // Return existing conversation
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          job:jobs(id, title),
          hirer:profiles!conversations_hirer_id_fkey(
            id, first_name, last_name, company_name, avatar_url
          ),
          professional:profiles!conversations_professional_id_fkey(
            id, first_name, last_name, avatar_url
          )
        `)
        .eq('id', existingConv.id)
        .single()

      if (error) throw error
      return data
    }

    // Create new conversation
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        job_id: jobId,
        hirer_id: hirerId,
        professional_id: professionalId
      })
      .select(`
        *,
        job:jobs(id, title),
        hirer:profiles!conversations_hirer_id_fkey(
          id, first_name, last_name, company_name, avatar_url
        ),
        professional:profiles!conversations_professional_id_fkey(
          id, first_name, last_name, avatar_url
        )
      `)
      .single()

    if (error) throw error
    return data
  },

  async getUnreadMessageCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .neq('sender_id', userId)
      .eq('is_read', false)
      .in('conversation_id', 
        supabase
          .from('conversations')
          .select('id')
          .or(`hirer_id.eq.${userId},professional_id.eq.${userId}`)
      )

    if (error) throw error
    return count || 0
  },

  subscribeToMessages(conversationId: string, callback: (message: Message) => void) {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          callback(payload.new as Message)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  },

  getParticipantName(conversation: Conversation, currentUserId: string): string {
    if (conversation.hirer_id === currentUserId) {
      return conversation.professional?.first_name && conversation.professional?.last_name
        ? `${conversation.professional.first_name} ${conversation.professional.last_name}`
        : 'Professional'
    } else {
      return conversation.hirer?.company_name || 
        (conversation.hirer?.first_name && conversation.hirer?.last_name
          ? `${conversation.hirer.first_name} ${conversation.hirer.last_name}`
          : 'Client')
    }
  },

  getParticipantAvatar(conversation: Conversation, currentUserId: string): string | null {
    if (conversation.hirer_id === currentUserId) {
      return conversation.professional?.avatar_url || null
    } else {
      return conversation.hirer?.avatar_url || null
    }
  },

  getParticipantInitials(conversation: Conversation, currentUserId: string): string {
    if (conversation.hirer_id === currentUserId) {
      return conversation.professional?.first_name && conversation.professional?.last_name
        ? `${conversation.professional.first_name[0]}${conversation.professional.last_name[0]}`
        : 'P'
    } else {
      return conversation.hirer?.company_name
        ? conversation.hirer.company_name[0]
        : conversation.hirer?.first_name && conversation.hirer?.last_name
          ? `${conversation.hirer.first_name[0]}${conversation.hirer.last_name[0]}`
          : 'C'
    }
  }
}