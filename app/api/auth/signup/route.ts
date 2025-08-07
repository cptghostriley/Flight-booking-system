import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists in Neon database
    const existingUsers = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user in Neon database
    const newUsers = await sql`
      INSERT INTO users (name, email, password, created_at, updated_at)
      VALUES (${name}, ${email}, ${hashedPassword}, NOW(), NOW())
      RETURNING id, name, email, created_at
    `
    
    const newUser = newUsers[0]

    // Generate a secure token
    const token = `token_${newUser.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      user: newUser,
      token,
      message: 'Account created successfully'
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
