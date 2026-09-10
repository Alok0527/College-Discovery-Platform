import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.cutoff.deleteMany()
  await prisma.review.deleteMany()
  await prisma.course.deleteMany()
  await prisma.college.deleteMany()
  await prisma.user.deleteMany()

  const colleges = await prisma.college.createMany({
    data: [
      {
        name: 'IIT Delhi',
        slug: 'iit-delhi',
        city: 'New Delhi',
        state: 'Delhi',
        location: 'Hauz Khas',
        fees: 250000,
        rating: 4.8,
        overview: 'Indian Institute of Technology Delhi is a public technical university located in Delhi, India. It was established in 1961 and is one of the premier engineering institutions in India.',
        placementAverage: 21.5,
        placementHighest: 1.5,
        imageUrl: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800',
      },
      {
        name: 'IIT Bombay',
        slug: 'iit-bombay',
        city: 'Mumbai',
        state: 'Maharashtra',
        location: 'Powai',
        fees: 230000,
        rating: 4.9,
        overview: 'Indian Institute of Technology Bombay is a public technical university located in Powai, Mumbai, India. It was established in 1958 and is one of the oldest IITs in India.',
        placementAverage: 23.1,
        placementHighest: 1.2,
        imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
      },
      {
        name: 'IIT Guwahati',
        slug: 'iit-guwahati',
        city: 'Guwahati',
        state: 'Assam',
        location: 'Amingaon',
        fees: 220000,
        rating: 4.7,
        overview: 'Indian Institute of Technology Guwahati is a public technical university located in Guwahati, Assam, India. It was established in 1994 and is known for its beautiful campus.',
        placementAverage: 19.8,
        placementHighest: 1.8,
        imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
      },
      {
        name: 'NIT Trichy',
        slug: 'nit-trichy',
        city: 'Tiruchirappalli',
        state: 'Tamil Nadu',
        location: 'Tiruchirappalli',
        fees: 180000,
        rating: 4.5,
        overview: 'National Institute of Technology Tiruchirappalli is a public technical university located in Tiruchirappalli, Tamil Nadu, India. It was established in 1964.',
        placementAverage: 15.2,
        placementHighest: 43.0,
        imageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800',
      },
      {
        name: 'NIT Rourkela',
        slug: 'nit-rourkela',
        city: 'Rourkela',
        state: 'Odisha',
        location: 'Rourkela',
        fees: 175000,
        rating: 4.3,
        overview: 'National Institute of Technology Rourkela is a public technical university located in Rourkela, Odisha, India. It was established in 1961.',
        placementAverage: 12.8,
        placementHighest: 52.0,
        imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
      },
      {
        name: 'BITS Pilani',
        slug: 'bits-pilani',
        city: 'Pilani',
        state: 'Rajasthan',
        location: 'Pilani',
        fees: 520000,
        rating: 4.4,
        overview: 'Birla Institute of Technology and Science Pilani is a private technical university located in Pilani, Rajasthan, India. It was established in 1964.',
        placementAverage: 18.5,
        placementHighest: 58.5,
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
      },
      {
        name: 'VIT Vellore',
        slug: 'vit-vellore',
        city: 'Vellore',
        state: 'Tamil Nadu',
        location: 'Vellore',
        fees: 350000,
        rating: 4.2,
        overview: 'Vellore Institute of Technology is a private technical university located in Vellore, Tamil Nadu, India. It was established in 1984.',
        placementAverage: 10.5,
        placementHighest: 1.02,
        imageUrl: 'https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=800',
      },
      {
        name: 'Anna University',
        slug: 'anna-university',
        city: 'Chennai',
        state: 'Tamil Nadu',
        location: 'Guindy',
        fees: 80000,
        rating: 4.0,
        overview: 'Anna University is a public technical university located in Chennai, Tamil Nadu, India. It was established in 1978 and is one of the oldest engineering colleges in India.',
        placementAverage: 8.5,
        placementHighest: 50.0,
        imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
      },
      {
        name: 'Jadavpur University',
        slug: 'jadavpur-university',
        city: 'Kolkata',
        state: 'West Bengal',
        location: 'Jadavpur',
        fees: 10000,
        rating: 4.6,
        overview: 'Jadavpur University is a public technical university located in Kolkata, West Bengal, India. It was established in 1955.',
        placementAverage: 12.0,
        placementHighest: 45.0,
        imageUrl: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=800',
      },
      {
        name: 'NIT Warangal',
        slug: 'nit-warangal',
        city: 'Warangal',
        state: 'Telangana',
        location: 'Hanmakonda',
        fees: 170000,
        rating: 4.4,
        overview: 'National Institute of Technology Warangal is a public technical university located in Warangal, Telangana, India. It was established in 1959.',
        placementAverage: 14.2,
        placementHighest: 64.0,
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      },
    ],
  })

  const collegeRecords = await prisma.college.findMany()
  const courses = [
    { name: 'Computer Science and Engineering', duration: 4 },
    { name: 'Electronics and Communication Engineering', duration: 4 },
    { name: 'Mechanical Engineering', duration: 4 },
    { name: 'Civil Engineering', duration: 4 },
    { name: 'Electrical Engineering', duration: 4 },
    { name: 'Chemical Engineering', duration: 4 },
    { name: 'Information Technology', duration: 4 },
    { name: 'Biotechnology', duration: 4 },
  ]

  for (const college of collegeRecords) {
    const numCourses = Math.floor(Math.random() * 4) + 4
    const selectedCourses = courses.slice(0, numCourses)
    for (const course of selectedCourses) {
      await prisma.course.create({
        data: {
          collegeId: college.id,
          name: course.name,
          duration: course.duration,
        },
      })
    }
  }

  const reviews = [
    { comment: 'Excellent faculty and infrastructure. Great placement opportunities.', rating: 5 },
    { comment: 'Good campus life and research facilities.', rating: 4 },
    { comment: 'Supportive faculty but placement could be better.', rating: 4 },
    { comment: 'Amazing college with great hostel facilities.', rating: 5 },
    { comment: 'Moderate college with decent placements.', rating: 3 },
  ]

  for (const college of collegeRecords) {
    const numReviews = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < numReviews; i++) {
      const review = reviews[Math.floor(Math.random() * reviews.length)]
      await prisma.review.create({
        data: {
          collegeId: college.id,
          rating: review.rating,
          comment: review.comment,
        },
      })
    }
  }

  const cutoffs = [
    { exam: 'JEE Main', branch: 'Computer Science and Engineering', category: 'General', openingRank: 1000, closingRank: 5000, homeState: false },
    { exam: 'JEE Main', branch: 'Computer Science and Engineering', category: 'OBC', openingRank: 3000, closingRank: 8000, homeState: false },
    { exam: 'JEE Main', branch: 'Computer Science and Engineering', category: 'SC', openingRank: 5000, closingRank: 15000, homeState: false },
    { exam: 'JEE Main', branch: 'Computer Science and Engineering', category: 'ST', openingRank: 8000, closingRank: 25000, homeState: false },
    { exam: 'JEE Main', branch: 'Electronics and Communication Engineering', category: 'General', openingRank: 5000, closingRank: 12000, homeState: false },
    { exam: 'JEE Main', branch: 'Mechanical Engineering', category: 'General', openingRank: 10000, closingRank: 25000, homeState: false },
    { exam: 'JEE Main', branch: 'Electrical Engineering', category: 'General', openingRank: 12000, closingRank: 30000, homeState: false },
    { exam: 'JEE Main', branch: 'Civil Engineering', category: 'General', openingRank: 20000, closingRank: 50000, homeState: false },
    { exam: 'JEE Main', branch: 'Information Technology', category: 'General', openingRank: 6000, closingRank: 15000, homeState: false },
    { exam: 'JEE Main', branch: 'Computer Science and Engineering', category: 'General', openingRank: 3000, closingRank: 10000, homeState: true },
    { exam: 'JEE Main', branch: 'Computer Science and Engineering', category: 'OBC', openingRank: 8000, closingRank: 18000, homeState: true },
    { exam: 'JEE Main', branch: 'Computer Science and Engineering', category: 'SC', openingRank: 15000, closingRank: 40000, homeState: true },
    { exam: 'JEE Main', branch: 'Computer Science and Engineering', category: 'ST', openingRank: 25000, closingRank: 60000, homeState: true },
    { exam: 'JEE Advanced', branch: 'Computer Science and Engineering', category: 'General', openingRank: 1, closingRank: 1000, homeState: false },
    { exam: 'JEE Advanced', branch: 'Electronics and Communication Engineering', category: 'General', openingRank: 500, closingRank: 3000, homeState: false },
    { exam: 'JEE Advanced', branch: 'Mechanical Engineering', category: 'General', openingRank: 2000, closingRank: 8000, homeState: false },
    { exam: 'JEE Advanced', branch: 'Electrical Engineering', category: 'General', openingRank: 3000, closingRank: 10000, homeState: false },
    { exam: 'JEE Advanced', branch: 'Civil Engineering', category: 'General', openingRank: 5000, closingRank: 15000, homeState: false },
  ]

  const nitTrichy = collegeRecords.find((c) => c.slug === 'nit-trichy')
  const nitRourkela = collegeRecords.find((c) => c.slug === 'nit-rourkela')
  const nitWarangal = collegeRecords.find((c) => c.slug === 'nit-warangal')
  const iitDelhi = collegeRecords.find((c) => c.slug === 'iit-delhi')
  const iitBombay = collegeRecords.find((c) => c.slug === 'iit-bombay')
  const iitGuwahati = collegeRecords.find((c) => c.slug === 'iit-guwahati')

  const nitColleges = [nitTrichy, nitRourkela, nitWarangal].filter(Boolean)
  const iitColleges = [iitDelhi, iitBombay, iitGuwahati].filter(Boolean)

  for (const college of nitColleges) {
    for (const cutoff of cutoffs) {
      await prisma.cutoff.create({
        data: {
          collegeId: college.id,
          exam: cutoff.exam,
          branch: cutoff.branch,
          category: cutoff.category,
          openingRank: cutoff.openingRank,
          closingRank: cutoff.closingRank,
          year: 2024,
        },
      })
    }
  }

  for (const college of iitColleges) {
    const iitCutoffs = cutoffs.map((c) => ({
      ...c,
      openingRank: Math.floor(c.openingRank / 10),
      closingRank: Math.floor(c.closingRank / 5),
    }))
    for (const cutoff of iitCutoffs) {
      await prisma.cutoff.create({
        data: {
          collegeId: college.id,
          exam: cutoff.exam,
          branch: cutoff.branch,
          category: cutoff.category,
          openingRank: cutoff.openingRank,
          closingRank: cutoff.closingRank,
          year: 2024,
        },
      })
    }
  }

  await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@collegefinder.com',
      password: 'hashedpassword',
    },
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })