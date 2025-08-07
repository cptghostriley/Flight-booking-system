// Simple in-memory authentication system for development
// In production, this would be replaced with a proper database

interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

interface Session {
  token: string
  userId: string
  expiresAt: number
}

// In-memory storage (will reset when server restarts)
const users: User[] = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@skyBooker.com",
    password: "$2a$10$8K1p/a0dQKKbWj6QFJKs4.qz4R8SXvI5VzQQN7DFklLiKQ8b7NvLq", // password: "demo123"
    createdAt: new Date().toISOString()
  }
]

const sessions: Session[] = []

// Helper to generate a simple token
export function generateToken(userId: string): string {
  const token = `token_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const session: Session = {
    token,
    userId,
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }
  sessions.push(session)
  return token
}

// Helper to validate token
export function validateToken(token: string): User | null {
  const session = sessions.find(s => s.token === token && s.expiresAt > Date.now())
  if (!session) return null
  
  const user = users.find(u => u.id === session.userId)
  return user || null
}

// Helper to find user by email
export function findUserByEmail(email: string): User | null {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null
}

// Helper to create new user
export function createUser(name: string, email: string, hashedPassword: string): User {
  const user: User = {
    id: (users.length + 1).toString(),
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    createdAt: new Date().toISOString()
  }
  users.push(user)
  return user
}

// Helper to get user without password
export function getUserWithoutPassword(user: User) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}

// Clean up expired sessions
setInterval(() => {
  const now = Date.now()
  for (let i = sessions.length - 1; i >= 0; i--) {
    if (sessions[i].expiresAt <= now) {
      sessions.splice(i, 1)
    }
  }
}, 60 * 60 * 1000) // Clean up every hour
