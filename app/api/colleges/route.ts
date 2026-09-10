import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CollegeFilters, ApiResponse, PaginatedResponse, College } from '@/types/college'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const search = searchParams.get('search')?.trim()
    const city = searchParams.get('city')?.trim()
    const state = searchParams.get('state')?.trim()
    const location = searchParams.get('location')?.trim()
    const minFees = searchParams.get('minFees')
    const maxFees = searchParams.get('maxFees')
    const minRating = searchParams.get('minRating')
    const course = searchParams.get('course')?.trim()
    const sortBy = searchParams.get('sortBy') as CollegeFilters['sortBy'] | null
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' | null
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    if (isNaN(page) || page < 1) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: 'Invalid page number' },
      }
      return NextResponse.json(response, { status: 400 })
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      const response: ApiResponse<null> = {
        success: false,
        error: { message: 'Invalid limit' },
      }
      return NextResponse.json(response, { status: 400 })
    }

    const where: CollegeFilters = {}

    if (search) {
      if (search.length > 100) {
        const response: ApiResponse<null> = {
          success: false,
          error: { message: 'Search query too long' },
        }
        return NextResponse.json(response, { status: 400 })
      }
      where.search = search
    }

    if (city) where.city = city
    if (state) where.state = state
    if (location) where.location = location

    if (minFees) {
      const min = parseInt(minFees)
      if (isNaN(min) || min < 0) {
        const response: ApiResponse<null> = {
          success: false,
          error: { message: 'Invalid minimum fees' },
        }
        return NextResponse.json(response, { status: 400 })
      }
      where.minFees = min
    }

    if (maxFees) {
      const max = parseInt(maxFees)
      if (isNaN(max) || max < 0) {
        const response: ApiResponse<null> = {
          success: false,
          error: { message: 'Invalid maximum fees' },
        }
        return NextResponse.json(response, { status: 400 })
      }
      where.maxFees = max
    }

    if (minRating) {
      const rating = parseFloat(minRating)
      if (isNaN(rating) || rating < 0 || rating > 5) {
        const response: ApiResponse<null> = {
          success: false,
          error: { message: 'Invalid minimum rating' },
        }
        return NextResponse.json(response, { status: 400 })
      }
      where.minRating = rating
    }

    if (course) where.course = course

    const orderBy: Record<string, string> = {}
    if (sortBy && ['name', 'fees', 'rating'].includes(sortBy)) {
      orderBy[sortBy] = sortOrder || 'asc'
    } else {
      orderBy['name'] = 'asc'
    }

    const whereClause: Record<string, unknown> = {}

    if (where.search) {
      whereClause.OR = [
        { name: { contains: String(where.search), mode: 'insensitive' } },
        { city: { contains: String(where.search), mode: 'insensitive' } },
        { state: { contains: String(where.search), mode: 'insensitive' } },
      ]
    }

    if (where.city) whereClause.city = where.city
    if (where.state) whereClause.state = where.state
    if (where.location) whereClause.location = { contains: where.location, mode: 'insensitive' }
    if (where.minFees || where.maxFees) {
      whereClause.fees = {}
      if (where.minFees) (whereClause.fees as Record<string, number>).gte = where.minFees
      if (where.maxFees) (whereClause.fees as Record<string, number>).lte = where.maxFees
    }
    if (where.minRating) whereClause.rating = { gte: where.minRating }

    if (where.course) {
      whereClause.courses = {
        some: {
          name: { contains: where.course, mode: 'insensitive' },
        },
      }
    }

    const [colleges, totalResults] = await Promise.all([
      prisma.college.findMany({
        where: whereClause,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          courses: {
            select: { name: true },
          },
        },
      }),
      prisma.college.count({ where: whereClause }),
    ])

    const totalPages = Math.ceil(totalResults / limit)

    const formattedColleges = colleges.map((college) => ({
      ...college,
      courses: college.courses.map((c) => c.name),
    }))

    const response: ApiResponse<PaginatedResponse<College>> = {
      success: true,
      data: {
        results: formattedColleges as unknown as College[],
        currentPage: page,
        totalPages,
        totalResults,
        limit,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching colleges:', error)
    const response: ApiResponse<null> = {
      success: false,
      error: { message: 'Something went wrong while loading the colleges' },
    }
    return NextResponse.json(response, { status: 500 })
  }
}