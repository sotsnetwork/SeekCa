'use client'

import { supabase } from './supabase'

export interface Notification {
  id: string
  user_id: string
  type: 'application' | 'message' | 'job_update' | 'review' | 'system'
  title: string
  message: string
  data: any
  is_read: boolean
  action_url?: string
  created_at: string
}

interface NotificationPreferences {
  id: string
  user_id: string
  email_notifications: boolean
  push_notifications: boolean
  application_updates: boolean
  message_notifications: boolean
  job_recommendations: boolean
  marketing_emails: boolean
}

export const notificationService = {
  async getNotifications(userId: string, limit = 50): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) throw error
    return count || 0
  },

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (error) throw error
  },

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) throw error
  },

  async deleteNotification(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)

    if (error) throw error
  },

  async createNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    data: any = {},
    actionUrl?: string
  ): Promise<Notification> {
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        data,
        action_url: actionUrl
      })
      .select()
      .single()

    if (error) throw error
    return notification
  },

  async getPreferences(userId: string): Promise<NotificationPreferences | null> {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async updatePreferences(
    userId: string, 
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const { data, error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: userId,
        ...preferences
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async subscribeToRealtime(userId: string, callback: (notification: Notification) => void) {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Notification)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  },

  getNotificationIcon(type: Notification['type']): string {
    switch (type) {
      case 'application':
        return '📋'
      case 'message':
        return '💬'
      case 'job_update':
        return '💼'
      case 'review':
        return '⭐'
      case 'system':
        return '🔔'
      default:
        return '📢'
    }
  },

  getNotificationColor(type: Notification['type']): string {
    switch (type) {
      case 'application':
        return 'text-blue-600'
      case 'message':
        return 'text-green-600'
      case 'job_update':
        return 'text-purple-600'
      case 'review':
        return 'text-yellow-600'
      case 'system':
        return 'text-gray-600'
      default:
        return 'text-blue-600'
    }
  }
}