import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - Fetch blog posts with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    const where: any = {
      published: true,
    };

    if (category) {
      where.category = category;
    }

    const [posts, totalPosts] = await prisma.$transaction([
      prisma.blogPost.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          publishedAt: 'desc',
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    const totalPages = Math.ceil(totalPosts / limit);

    return NextResponse.json({
      posts,
      metadata: {
        totalPosts,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// POST - Create new blog post (admin only - add authentication later)
export async function POST(request: Request) {
  try {
    // TODO: Add authentication to protect this endpoint
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      author,
      published,
      publishedAt,
    } = body;

    // Validate required fields
    if (!title || !slug || !excerpt || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, excerpt, content, category' },
        { status: 400 }
      );
    }

    // Create blog post
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage: coverImage || null,
        category,
        tags: tags || [],
        author: author || 'NYC Peer Guide',
        published: published || false,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        post,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Failed to create blog post:', error);

    // Handle unique constraint violation (duplicate slug)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
