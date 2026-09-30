import { NextResponse } from 'next/server';
import { getSessionUser, COOKIE_NAME } from '@/lib/auth';

export async function GET() {
  try {
    const user = getSessionUser();
    if (!user) {
      return NextResponse.json({ user: null });
    }
    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json({ user: null });
  }
}
