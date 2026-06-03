import { NextRequest, NextResponse } from 'next/server';
import {
  getProfile,
  updateProfile,
  getResearchList,
  getPublicationList,
  getTeachingList,
  getActivityList,
  getDashboardStats,
  getSettings,
  updateSettings,
  createResearch,
  updateResearch,
  deleteResearch,
  createPublication,
  updatePublication,
  deletePublication,
  createTeaching,
  updateTeaching,
  deleteTeaching,
  createActivity,
  updateActivity,
  deleteActivity,
} from '@/content';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const isAdmin = searchParams.get('admin') === '1';

  try {
    switch (type) {
      case 'profile':
        return NextResponse.json(await getProfile());
      case 'research':
        if (id) {
          const item = await getResearchList().then(items => items.find(i => i.id === id));
          return NextResponse.json(item || null);
        }
        return NextResponse.json(await getResearchList(isAdmin ? undefined : { published: true }));
      case 'publications':
        return NextResponse.json(await getPublicationList(isAdmin ? undefined : { published: true }));
      case 'teaching':
        return NextResponse.json(await getTeachingList(isAdmin ? undefined : { published: true }));
      case 'activities':
        return NextResponse.json(await getActivityList(isAdmin ? undefined : { published: true }));
      case 'stats':
        return NextResponse.json(await getDashboardStats());
      case 'settings':
        return NextResponse.json(await getSettings());
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    const body = await request.json();

    switch (type) {
      case 'research':
        return NextResponse.json(await createResearch(body));
      case 'publications':
        return NextResponse.json(await createPublication(body));
      case 'teaching':
        return NextResponse.json(await createTeaching(body));
      case 'activities':
        return NextResponse.json(await createActivity(body));
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  if (!id && type !== 'profile' && type !== 'settings') {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();

    switch (type) {
      case 'profile':
        return NextResponse.json(await updateProfile(body));
      case 'settings':
        return NextResponse.json(await updateSettings(body));
      case 'research':
        return NextResponse.json(await updateResearch(id!, body));
      case 'publications':
        return NextResponse.json(await updatePublication(id!, body));
      case 'teaching':
        return NextResponse.json(await updateTeaching(id!, body));
      case 'activities':
        return NextResponse.json(await updateActivity(id!, body));
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    let success = false;

    switch (type) {
      case 'research':
        success = await deleteResearch(id);
        break;
      case 'publications':
        success = await deletePublication(id);
        break;
      case 'teaching':
        success = await deleteTeaching(id);
        break;
      case 'activities':
        success = await deleteActivity(id);
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    if (!success) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 });
  }
}
