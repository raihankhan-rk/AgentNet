import { agentManager } from '@/agents/agentInit';
import { NextResponse } from 'next/server';

// Mark this as a server-side only route
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!agentManager.initialized) {
      await agentManager.initialize();
    }

    const response = await agentManager.handleMessage(message);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' }, 
      { status: 500 }
    );
  }
} 