
import { CompetencyUpdate, ProgressUpdate } from '../types/competency'

export interface WebSocketMessage {
  type: 'competency_update' | 'progress_update' | 'level_up' | 'tool_unlock' | 'milestone_achieved' | 'ping' | 'pong'
  data: any
  timestamp: string
  userId: string
}

export interface WebSocketConfig {
  url: string
  reconnectInterval: number
  maxReconnectAttempts: number
  heartbeatInterval: number
}

export type WebSocketEventHandler = (message: WebSocketMessage) => void

export class WebSocketService {
  private ws: WebSocket | null = null
  private config: WebSocketConfig
  private userId: string
  private eventHandlers: Map<string, WebSocketEventHandler[]> = new Map()
  private reconnectAttempts = 0
  private reconnectTimer: NodeJS.Timeout | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null
  private isConnecting = false

  constructor(userId: string, config?: Partial<WebSocketConfig>) {
    this.userId = userId
    this.config = {
      url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws',
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      ...config
    }
  }

  async connect(): Promise<void> {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return
    }

    this.isConnecting = true

    try {
      const wsUrl = `${this.config.url}/${this.userId}`
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = this.handleOpen.bind(this)
      this.ws.onmessage = this.handleMessage.bind(this)
      this.ws.onclose = this.handleClose.bind(this)
      this.ws.onerror = this.handleError.bind(this)

    } catch (error) {
      console.error('WebSocket connection error:', error)
      this.isConnecting = false
      this.scheduleReconnect()
    }
  }

  disconnect(): void {
    this.clearTimers()
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }
    
    this.reconnectAttempts = 0
  }

  send(message: Partial<WebSocketMessage>): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, cannot send message')
      return
    }

    const fullMessage: WebSocketMessage = {
      type: message.type || 'ping',
      data: message.data || {},
      timestamp: new Date().toISOString(),
      userId: this.userId,
      ...message
    }

    try {
      this.ws.send(JSON.stringify(fullMessage))
    } catch (error) {
      console.error('Error sending WebSocket message:', error)
    }
  }

  subscribe(eventType: string, handler: WebSocketEventHandler): () => void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, [])
    }
    
    this.eventHandlers.get(eventType)!.push(handler)
    
    // Return unsubscribe function
    return () => {
      const handlers = this.eventHandlers.get(eventType)
      if (handlers) {
        const index = handlers.indexOf(handler)
        if (index > -1) {
          handlers.splice(index, 1)
        }
      }
    }
  }

  getConnectionState(): 'connecting' | 'open' | 'closing' | 'closed' {
    if (!this.ws) return 'closed'
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting'
      case WebSocket.OPEN:
        return 'open'
      case WebSocket.CLOSING:
        return 'closing'
      case WebSocket.CLOSED:
        return 'closed'
      default:
        return 'closed'
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  private handleOpen(): void {
    console.log('WebSocket connected')
    this.isConnecting = false
    this.reconnectAttempts = 0
    this.startHeartbeat()
    this.emit('connected', { timestamp: new Date().toISOString() })
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data)
      
      // Handle heartbeat
      if (message.type === 'ping') {
        this.send({ type: 'pong' })
        return
      }
      
      if (message.type === 'pong') {
        return
      }
      
      // Emit message to subscribers
      this.emit(message.type, message)
      
    } catch (error) {
      console.error('Error parsing WebSocket message:', error)
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log('WebSocket disconnected:', event.code, event.reason)
    this.isConnecting = false
    this.clearTimers()
    this.emit('disconnected', { 
      code: event.code, 
      reason: event.reason, 
      timestamp: new Date().toISOString() 
    })
    
    // Schedule reconnect if not a clean close
    if (event.code !== 1000) {
      this.scheduleReconnect()
    }
  }

  private handleError(error: Event): void {
    console.error('WebSocket error:', error)
    this.isConnecting = false
    this.emit('error', { error, timestamp: new Date().toISOString() })
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      this.emit('max_reconnect_attempts', { 
        attempts: this.reconnectAttempts, 
        timestamp: new Date().toISOString() 
      })
      return
    }

    this.reconnectAttempts++
    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${this.config.reconnectInterval}ms`)
    
    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, this.config.reconnectInterval)
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send({ type: 'ping' })
      }
    }, this.config.heartbeatInterval)
  }

  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  private emit(eventType: string, data: any): void {
    const handlers = this.eventHandlers.get(eventType)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data)
        } catch (error) {
          console.error('Error in WebSocket event handler:', error)
        }
      })
    }
  }
}

export class CompetencyWebSocketService extends WebSocketService {
  constructor(userId: string, config?: Partial<WebSocketConfig>) {
    super(userId, config)
  }

  onCompetencyUpdate(handler: (update: CompetencyUpdate) => void): () => void {
    return this.subscribe('competency_update', (message) => {
      handler(message.data as CompetencyUpdate)
    })
  }

  onProgressUpdate(handler: (update: ProgressUpdate) => void): () => void {
    return this.subscribe('progress_update', (message) => {
      handler(message.data as ProgressUpdate)
    })
  }

  onLevelUp(handler: (data: { newLevel: string; points: number }) => void): () => void {
    return this.subscribe('level_up', (message) => {
      handler(message.data as { newLevel: string; points: number })
    })
  }

  onToolUnlock(handler: (data: { toolName: string; unlockedAt: string }) => void): () => void {
    return this.subscribe('tool_unlock', (message) => {
      handler(message.data as { toolName: string; unlockedAt: string })
    })
  }

  onMilestoneAchieved(handler: (data: { milestoneId: string; title: string; points: number }) => void): () => void {
    return this.subscribe('milestone_achieved', (message) => {
      handler(message.data as { milestoneId: string; title: string; points: number })
    })
  }

  sendProgressUpdate(update: ProgressUpdate): void {
    this.send({
      type: 'progress_update',
      data: update
    })
  }

  sendCompetencyUpdate(update: CompetencyUpdate): void {
    this.send({
      type: 'competency_update',
      data: update
    })
  }
}

export function useCompetencyWebSocket(userId: string) {
  const [wsService] = useState(() => new CompetencyWebSocketService(userId))
  const [connectionState, setConnectionState] = useState<'connecting' | 'open' | 'closing' | 'closed'>('closed')
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)

  useEffect(() => {
    // Connect on mount
    wsService.connect()

    // Subscribe to connection state changes
    const unsubscribeConnected = wsService.subscribe('connected', () => {
      setConnectionState('open')
    })

    const unsubscribeDisconnected = wsService.subscribe('disconnected', () => {
      setConnectionState('closed')
    })

    const unsubscribeError = wsService.subscribe('error', () => {
      setConnectionState('closed')
    })

    // Subscribe to all messages
    const unsubscribeMessages = wsService.subscribe('*', (message) => {
      setLastMessage(message)
    })

    // Cleanup on unmount
    return () => {
      unsubscribeConnected()
      unsubscribeDisconnected()
      unsubscribeError()
      unsubscribeMessages()
      wsService.disconnect()
    }
  }, [wsService])

  return {
    wsService,
    connectionState,
    lastMessage,
    isConnected: wsService.isConnected(),
    connect: () => wsService.connect(),
    disconnect: () => wsService.disconnect()
  }
}

// Import useState and useEffect for the hook
import { useState, useEffect } from 'react'
