import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import PriceItem from '@/models/PriceItem';
import ActionLog from '@/models/ActionLog';
import translate from 'google-translate-api-x';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function transliterate(text: string): Promise<string> {
  const url = `https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=hi-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=test`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data[0] === 'SUCCESS') {
      return data[1][0][1][0];
    }
  } catch (e) {
    console.error('Transliteration failed', e);
  }
  return text;
}

export async function GET(req: NextRequest) {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized: No organization selected' }, { status: 401 });
    }

    await dbConnect();
    const prices = await PriceItem.find({ organizationId: orgId }).sort({ createdAt: -1 });
    return NextResponse.json(prices);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { orgId, has } = await auth();
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized: No organization selected' }, { status: 401 });
    }
    
    // Only org admins can create (or members if allowed, let's allow all members for now, or check permissions)
    // if (!has({ role: 'org:admin' })) { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }

    const body = await req.json();
    const { name, price, qty, unit, isVisible, image } = body;

    if (!name || price == null) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }

    await dbConnect();
    
    const isHindi = /[\u0900-\u097F]/.test(name);
    let finalName = name;
    let nameHi = '';

    if (isHindi) {
      nameHi = name;
      try {
        const res: any = await translate(name, { from: 'hi', to: 'en' });
        finalName = res.text;
      } catch (e) {
        console.error('Translation failed', e);
      }
    } else {
      nameHi = await transliterate(name);
    }

    let imageUrl;
    if (image && image.startsWith('data:image')) {
      try {
        const uploadRes = await cloudinary.uploader.upload(image, {
          folder: 'price-list-items',
        });
        imageUrl = uploadRes.secure_url;
      } catch (err) {
        console.error('Cloudinary upload failed:', err);
      }
    }

    const newItem = await PriceItem.create({
      name: finalName,
      nameHi,
      price,
      qty: qty !== undefined ? qty : 1,
      unit: unit || 'pcs',
      isVisible: isVisible !== undefined ? isVisible : true,
      imageUrl,
      organizationId: orgId,
    });

    const user = await currentUser();
    const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.primaryEmailAddress?.emailAddress || 'Unknown Member' : 'Unknown Member';
    
    await ActionLog.create({
      organizationId: orgId,
      userId: user?.id || 'unknown',
      userName,
      action: 'CREATE',
      itemName: name,
      details: `Added new item: ${name} (₹${price})`
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized: No organization selected' }, { status: 401 });
    }

    const body = await req.json();
    const { id, isVisible, name, price, qty, unit, image } = body;

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    await dbConnect();
    const updateData: any = {};
    if (isVisible !== undefined) updateData.isVisible = isVisible;
    if (name !== undefined) {
      const isHindi = /[\u0900-\u097F]/.test(name);
      if (isHindi) {
        updateData.nameHi = name;
        try {
          const res: any = await translate(name, { from: 'hi', to: 'en' });
          updateData.name = res.text;
        } catch (e) {
          console.error('Translation failed', e);
          updateData.name = name; // fallback
        }
      } else {
        updateData.name = name;
        updateData.nameHi = await transliterate(name);
      }
    }
    if (price !== undefined) updateData.price = price;
    if (qty !== undefined) updateData.qty = qty;
    if (unit !== undefined) updateData.unit = unit;

    if (image && image.startsWith('data:image')) {
      try {
        const uploadRes = await cloudinary.uploader.upload(image, {
          folder: 'price-list-items',
        });
        updateData.imageUrl = uploadRes.secure_url;
      } catch (err) {
        console.error('Cloudinary upload failed:', err);
      }
    } else if (image === '') {
      updateData.imageUrl = '';
    }

    const updatedItem = await PriceItem.findOneAndUpdate(
      { _id: id, organizationId: orgId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const user = await currentUser();
    const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.primaryEmailAddress?.emailAddress || 'Unknown Member' : 'Unknown Member';
    
    await ActionLog.create({
      organizationId: orgId,
      userId: user?.id || 'unknown',
      userName,
      action: 'UPDATE',
      itemName: updatedItem.name,
      details: `Updated item details`
    });

    return NextResponse.json(updatedItem);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return NextResponse.json({ error: 'Unauthorized: No organization selected' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    await dbConnect();
    const deletedItem = await PriceItem.findOneAndDelete({ _id: id, organizationId: orgId });

    if (!deletedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Delete image from Cloudinary if it exists
    if (deletedItem.imageUrl && deletedItem.imageUrl.includes('cloudinary.com')) {
      try {
        const urlParts = deletedItem.imageUrl.split('/');
        const filenameWithExt = urlParts.pop();
        const folder = urlParts.pop();
        const filename = filenameWithExt?.split('.')[0];
        if (folder && filename) {
          const publicId = `${folder}/${filename}`;
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (err) {
        console.error('Failed to delete image from Cloudinary:', err);
      }
    }

    const user = await currentUser();
    const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.primaryEmailAddress?.emailAddress || 'Unknown Member' : 'Unknown Member';
    
    await ActionLog.create({
      organizationId: orgId,
      userId: user?.id || 'unknown',
      userName,
      action: 'DELETE',
      itemName: deletedItem.name,
      details: `Deleted item: ${deletedItem.name}`
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
