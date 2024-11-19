import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnection from '@/lib/dbConnect';
import { authOptions } from '../../auth/[...nextauth]/options';
import UserModel from '@/model/UserSchema';




export async function GET() {
   await dbConnection();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?._id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user._id;
  try {
    const user = await UserModel.findById(userId);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ message: 'Error fetching user profile' }, { status: 500 });
  }
}



export async function PUT(req: Request) {
    await dbConnection();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?._id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user._id;
  const data = await req.json();

  try {
    const user = await UserModel.findByIdAndUpdate(userId, data, { new: true });
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ message: 'Error updating user profile' }, { status: 500 });
  }
};