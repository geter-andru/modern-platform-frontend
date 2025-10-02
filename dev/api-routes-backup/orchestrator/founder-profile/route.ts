
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { requireAuth, AuthContext } from '@/lib/middleware/auth';
import { createClient } from '@/lib/supabase/server';

// In-memory storage (replace with database in production)
const founderProfiles = new Map<string, any>();
const scalingStatus = new Map<string, any>();

export const POST = requireAuth(async (request: NextRequest, auth: AuthContext) => {
  try {
    const supabase = await createClient();
    const body = await request.json() as { profileData: any };
    const { profileData } = body;

    if (!profileData) {
      return NextResponse.json(
        { error: 'Profile data is required' },
        { status: 400 }
      );
};
    // Create founder profile
    const founderProfile = {
      userId: auth.user.id,
      ...profileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    founderProfiles.set(auth.user.id, founderProfile);

    return NextResponse.json({
      success: true,
      profile: founderProfile
    });

  } catch (error) {
    console.error('Error creating founder profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});
export const GET = requireAuth(async (request: NextRequest, auth: AuthContext) => {
  try {
    const supabase = await createClient();
    const profile = founderProfiles.get(auth.user.id);

    if (!profile) {
      return NextResponse.json(
        { error: 'No profile found' },
        { status: 404 }
      );
};
    return NextResponse.json({
      success: true,
      profile
    });

  } catch (error) {
    console.error('Error retrieving founder profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});