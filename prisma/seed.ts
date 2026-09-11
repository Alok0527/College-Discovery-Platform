import { PrismaClient } from '@prisma/client'
import { randomBytes, scryptSync } from 'crypto'

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

const collegeData = [
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
    imageUrl: '/colleges/iit-delhi.jpg',
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
    imageUrl: '/colleges/iit-bombay.jpg',
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
    imageUrl: '/colleges/iit-guwahati.jpg',
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
    imageUrl: '/colleges/nit-trichy.jpg',
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
    imageUrl: '/colleges/nit-rourkela.jpg',
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
    imageUrl: '/colleges/bits-pilani.jpg',
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
    imageUrl: '/colleges/vit-vellore.jpg',
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
    imageUrl: '/colleges/anna-university.jpg',
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
    imageUrl: '/colleges/jadavpur-university.jpg',
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
    imageUrl: '/colleges/nit-warangal.jpg',
  },
  {
    name: 'IIT Kharagpur',
    slug: 'iit-kharagpur',
    city: 'Kharagpur',
    state: 'West Bengal',
    location: 'Kharagpur',
    fees: 230000,
    rating: 4.7,
    overview: 'Indian Institute of Technology Kharagpur is a public technical university located in Kharagpur, West Bengal, India. Established in 1951, it is the oldest IIT in the country.',
    placementAverage: 20.2,
    placementHighest: 72.0,
    imageUrl: '/colleges/iit-kharagpur.jpg',
  },
  {
    name: 'IIT Madras',
    slug: 'iit-madras',
    city: 'Chennai',
    state: 'Tamil Nadu',
    location: 'Guindy',
    fees: 240000,
    rating: 4.8,
    overview: 'Indian Institute of Technology Madras is a public technical university located in Chennai, Tamil Nadu, India. It was established in 1959 and is ranked among the top IITs.',
    placementAverage: 21.3,
    placementHighest: 87.0,
    imageUrl: '/colleges/iit-madras.jpg',
  },
  {
    name: 'IIT Kanpur',
    slug: 'iit-kanpur',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    location: 'Kalyanpur',
    fees: 230000,
    rating: 4.7,
    overview: 'Indian Institute of Technology Kanpur is a public technical university located in Kanpur, Uttar Pradesh, India. It was established in 1959 with assistance from MIT.',
    placementAverage: 19.5,
    placementHighest: 80.0,
    imageUrl: '/colleges/iit-kanpur.jpg',
  },
  {
    name: 'IIT Roorkee',
    slug: 'iit-roorkee',
    city: 'Roorkee',
    state: 'Uttarakhand',
    location: 'Roorkee',
    fees: 230000,
    rating: 4.6,
    overview: 'Indian Institute of Technology Roorkee is a public technical university in Roorkee, Uttarakhand, India. Established in 1847, it is the oldest engineering institution on the Indian subcontinent.',
    placementAverage: 18.7,
    placementHighest: 70.0,
    imageUrl: '/colleges/iit-roorkee.jpg',
  },
  {
    name: 'IIT Hyderabad',
    slug: 'iit-hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    location: 'Sangareddy',
    fees: 230000,
    rating: 4.6,
    overview: 'Indian Institute of Technology Hyderabad is a public technical university located in Sangareddy, Telangana, India. It was established in 2008 and has risen rapidly in national rankings.',
    placementAverage: 21.0,
    placementHighest: 78.0,
    imageUrl: '/colleges/iit-hyderabad.png',
  },
  {
    name: 'IIT Gandhinagar',
    slug: 'iit-gandhinagar',
    city: 'Gandhinagar',
    state: 'Gujarat',
    location: 'Palaj',
    fees: 230000,
    rating: 4.5,
    overview: 'Indian Institute of Technology Gandhinagar is a public technical university located in Gandhinagar, Gujarat, India. It was established in 2008 and is known for its interdisciplinary approach.',
    placementAverage: 16.8,
    placementHighest: 68.0,
    imageUrl: '/colleges/iit-gandhinagar.jpg',
  },
  {
    name: 'IIT Indore',
    slug: 'iit-indore',
    city: 'Indore',
    state: 'Madhya Pradesh',
    location: 'Simrol',
    fees: 230000,
    rating: 4.4,
    overview: 'Indian Institute of Technology Indore is a public technical university located in Simrol, Indore, Madhya Pradesh, India. It was established in 2009.',
    placementAverage: 16.2,
    placementHighest: 65.0,
    imageUrl: '/colleges/iit-indore.jpg',
  },
  {
    name: 'NITK Surathkal',
    slug: 'nitk-surathkal',
    city: 'Mangaluru',
    state: 'Karnataka',
    location: 'Surathkal',
    fees: 160000,
    rating: 4.4,
    overview: 'National Institute of Technology Karnataka is a public technical university located in Surathkal, Mangaluru, Karnataka, India. It was established in 1960.',
    placementAverage: 14.5,
    placementHighest: 61.0,
    imageUrl: '/colleges/nitk-surathkal.jpg',
  },
  {
    name: 'NIT Calicut',
    slug: 'nit-calicut',
    city: 'Kozhikode',
    state: 'Kerala',
    location: 'Kattangal',
    fees: 150000,
    rating: 4.2,
    overview: 'National Institute of Technology Calicut is a public technical university located in Kozhikode, Kerala, India. It was established in 1961 as a Regional Engineering College.',
    placementAverage: 12.8,
    placementHighest: 55.0,
    imageUrl: '/colleges/nit-calicut.jpg',
  },
  {
    name: 'NIT Durgapur',
    slug: 'nit-durgapur',
    city: 'Durgapur',
    state: 'West Bengal',
    location: 'Fatepur Rajbandh',
    fees: 150000,
    rating: 4.1,
    overview: 'National Institute of Technology Durgapur is a public technical university located in Durgapur, West Bengal, India. It was established in 1960 as a Regional Engineering College.',
    placementAverage: 11.5,
    placementHighest: 49.0,
    imageUrl: '/colleges/nit-durgapur.jpg',
  },
  {
    name: 'NIT Patna',
    slug: 'nit-patna',
    city: 'Patna',
    state: 'Bihar',
    location: 'Ashok Rajpath',
    fees: 145000,
    rating: 4.0,
    overview: 'National Institute of Technology Patna is a public technical university located in Patna, Bihar, India. It traces its origin to the 1886 college and became an NIT in 2004.',
    placementAverage: 10.5,
    placementHighest: 46.0,
    imageUrl: '/colleges/nit-patna.jpg',
  },
  {
    name: 'NIT Jamshedpur',
    slug: 'nit-jamshedpur',
    city: 'Jamshedpur',
    state: 'Jharkhand',
    location: 'Adityapur',
    fees: 145000,
    rating: 4.0,
    overview: 'National Institute of Technology Jamshedpur is a public technical university located in Jamshedpur, Jharkhand, India. It was established in 1960 as a Regional Institute of Technology.',
    placementAverage: 10.2,
    placementHighest: 45.0,
    imageUrl: '/colleges/nit-jamshedpur.jpg',
  },
  {
    name: 'NIT Kurukshetra',
    slug: 'nit-kurukshetra',
    city: 'Kurukshetra',
    state: 'Haryana',
    location: 'Thanesar',
    fees: 150000,
    rating: 3.9,
    overview: 'National Institute of Technology Kurukshetra is a public technical university located in Kurukshetra, Haryana, India. It was established in 1963 as a Regional Engineering College.',
    placementAverage: 9.8,
    placementHighest: 42.0,
    imageUrl: '/colleges/nit-kurukshetra.png',
  },
  {
    name: 'SVNIT Surat',
    slug: 'svnit-surat',
    city: 'Surat',
    state: 'Gujarat',
    location: 'Ichchhanath',
    fees: 155000,
    rating: 4.1,
    overview: 'Sardar Vallabhbhai National Institute of Technology Surat is a public technical university in Surat, Gujarat, India. It was established in 1961 as a Regional Engineering College.',
    placementAverage: 11.8,
    placementHighest: 52.0,
    imageUrl: '/colleges/svnit-surat.jpg',
  },
  {
    name: 'VNIT Nagpur',
    slug: 'vnit-nagpur',
    city: 'Nagpur',
    state: 'Maharashtra',
    location: 'Ambazari',
    fees: 155000,
    rating: 4.2,
    overview: 'Visvesvaraya National Institute of Technology Nagpur is a public technical university in Nagpur, Maharashtra, India. It was established in 1960 as a Regional College of Engineering.',
    placementAverage: 12.5,
    placementHighest: 54.0,
    imageUrl: '/colleges/vnit-nagpur.jpg',
  },
  {
    name: 'IIIT Hyderabad',
    slug: 'iiit-hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    location: 'Gachibowli',
    fees: 330000,
    rating: 4.7,
    overview: 'International Institute of Information Technology Hyderabad is a private research university located in Gachibowli, Hyderabad, Telangana, India. It was established in 1998 and is known for its research output.',
    placementAverage: 25.5,
    placementHighest: 90.0,
    imageUrl: '/colleges/iiit-hyderabad.jpg',
  },
  {
    name: 'IIIT Delhi',
    slug: 'iiit-delhi',
    city: 'New Delhi',
    state: 'Delhi',
    location: 'Okhla',
    fees: 200000,
    rating: 4.3,
    overview: 'Indraprastha Institute of Information Technology Delhi is a public research university located in Okhla, New Delhi, India. It was established in 2008.',
    placementAverage: 18.2,
    placementHighest: 75.0,
    imageUrl: '/colleges/iiit-delhi.jpg',
  },
  {
    name: 'IIIT Allahabad',
    slug: 'iiit-allahabad',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    location: 'Jhalwa',
    fees: 155000,
    rating: 4.1,
    overview: 'Indian Institute of Information Technology Allahabad is a public technical university located in Prayagraj, Uttar Pradesh, India. It was established in 1999.',
    placementAverage: 12.0,
    placementHighest: 50.0,
    imageUrl: '/colleges/iiit-allahabad.jpg',
  },
  {
    name: 'MANIT Bhopal',
    slug: 'manit-bhopal',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    location: 'Bhopal',
    fees: 155000,
    rating: 4.0,
    overview: 'Maulana Azad National Institute of Technology Bhopal is a public technical university located in Bhopal, Madhya Pradesh, India. It was established in 1960 as a Regional Engineering College.',
    placementAverage: 11.2,
    placementHighest: 48.0,
    imageUrl: '/colleges/manit-bhopal.jpg',
  },
  {
    name: 'DTU Delhi',
    slug: 'dtu-delhi',
    city: 'New Delhi',
    state: 'Delhi',
    location: 'Shahbad Daulatpur',
    fees: 120000,
    rating: 4.2,
    overview: 'Delhi Technological University is a public technical university located in Rohini, New Delhi, India. It was established in 1941 as Delhi College of Engineering.',
    placementAverage: 12.8,
    placementHighest: 56.0,
    imageUrl: '/colleges/dtu-delhi.jpg',
  },
  {
    name: 'NSUT Delhi',
    slug: 'nsut-delhi',
    city: 'New Delhi',
    state: 'Delhi',
    location: 'Dwarka',
    fees: 110000,
    rating: 4.0,
    overview: 'Netaji Subhas University of Technology is a public technical university located in Dwarka, New Delhi, India. It was established in 1983 as Delhi Institute of Technology.',
    placementAverage: 11.5,
    placementHighest: 50.0,
    imageUrl: '/colleges/nsut-delhi.jpg',
  },
  {
    name: 'IIEST Shibpur',
    slug: 'iiest-shibpur',
    city: 'Howrah',
    state: 'West Bengal',
    location: 'Shibpur',
    fees: 120000,
    rating: 4.1,
    overview: 'Indian Institute of Engineering Science and Technology Shibpur is a public technical university located in Howrah, West Bengal, India. It traces its origins to 1856 as the BESU.',
    placementAverage: 12.2,
    placementHighest: 51.0,
    imageUrl: '/colleges/iiest-shibpur.jpg',
  },
  {
    name: 'PEC Chandigarh',
    slug: 'pec-chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh',
    location: 'Sector 12',
    fees: 120000,
    rating: 4.2,
    overview: 'Punjab Engineering College is a public technical university located in Sector 12, Chandigarh, India. It was established in 1921 and is one of the oldest engineering colleges in India.',
    placementAverage: 12.5,
    placementHighest: 53.0,
    imageUrl: '/colleges/pec-chandigarh.jpg',
  },
  {
    name: 'COEP Pune',
    slug: 'coep-pune',
    city: 'Pune',
    state: 'Maharashtra',
    location: 'Shivajinagar',
    fees: 140000,
    rating: 4.3,
    overview: 'College of Engineering Pune is a public technical university located in Shivajinagar, Pune, Maharashtra, India. It was established in 1854 and is one of the oldest engineering institutions in India.',
    placementAverage: 13.5,
    placementHighest: 58.0,
    imageUrl: '/colleges/coep-pune.jpg',
  },
  {
    name: 'Andhra University',
    slug: 'andhra-university',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    location: 'Waltair',
    fees: 70000,
    rating: 3.8,
    overview: 'Andhra University is a public state university located in Visakhapatnam, Andhra Pradesh, India. It was established in 1926 and is one of the oldest universities in India.',
    placementAverage: 7.5,
    placementHighest: 30.0,
    imageUrl: '/colleges/andhra-university.jpg',
  },
  {
    name: 'Thapar Institute of Engineering and Technology',
    slug: 'thapar-patiala',
    city: 'Patiala',
    state: 'Punjab',
    location: 'Patiala',
    fees: 350000,
    rating: 4.2,
    overview: 'Thapar Institute of Engineering and Technology is a private technical university located in Patiala, Punjab, India. It was established in 1956 and is among the oldest private engineering institutions in India.',
    placementAverage: 11.8,
    placementHighest: 55.0,
    imageUrl: '/colleges/thapar-patiala.jpg',
  },
  {
    name: 'BIT Mesra',
    slug: 'bit-mesra',
    city: 'Ranchi',
    state: 'Jharkhand',
    location: 'Mesra',
    fees: 250000,
    rating: 4.0,
    overview: 'Birla Institute of Technology Mesra is a private technical university located in Mesra, Ranchi, Jharkhand, India. It was established in 1955 by the Birla Education Trust.',
    placementAverage: 10.8,
    placementHighest: 48.0,
    imageUrl: '/colleges/bit-mesra.jpg',
  },
  {
    name: 'KIIT Bhubaneswar',
    slug: 'kiit-bhubaneswar',
    city: 'Bhubaneswar',
    state: 'Odisha',
    location: 'Patia',
    fees: 280000,
    rating: 4.1,
    overview: 'Kalinga Institute of Industrial Technology is a private technical university located in Bhubaneswar, Odisha, India. It was established in 1992 and is a deemed university.',
    placementAverage: 9.5,
    placementHighest: 44.0,
    imageUrl: '/colleges/kiit-bhubaneswar.jpg',
  },
  {
    name: 'Manipal Institute of Technology',
    slug: 'mit-manipal',
    city: 'Manipal',
    state: 'Karnataka',
    location: 'Manipal',
    fees: 420000,
    rating: 4.3,
    overview: 'Manipal Institute of Technology is a private technical institution located in Manipal, Karnataka, India. It was established in 1957 and is a constituent of Manipal Academy of Higher Education.',
    placementAverage: 12.5,
    placementHighest: 57.0,
    imageUrl: '/colleges/mit-manipal.jpg',
  },
  {
    name: 'RV College of Engineering',
    slug: 'rvce-bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    location: 'Mysuru Road',
    fees: 190000,
    rating: 4.2,
    overview: 'Rashtreeya Vidyalaya College of Engineering is a private engineering college located in Bengaluru, Karnataka, India. It was established in 1963 and is affiliated to Visvesvaraya Technological University.',
    placementAverage: 10.8,
    placementHighest: 52.0,
    imageUrl: '/colleges/rvce-bengaluru.jpg',
  },
]

async function main() {
  await prisma.cutoff.deleteMany()
  await prisma.review.deleteMany()
  await prisma.course.deleteMany()
  await prisma.college.deleteMany()
  await prisma.user.deleteMany()

  await prisma.college.createMany({
    data: collegeData,
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

  const courseResults: { collegeId: string; name: string; duration: number }[] = []
  for (const college of collegeRecords) {
    const numCourses = Math.floor(Math.random() * 4) + 4
    const selectedCourses = courses.slice(0, numCourses)
    for (const course of selectedCourses) {
      courseResults.push({
        collegeId: college.id,
        name: course.name,
        duration: course.duration,
      })
    }
  }
  for (let i = 0; i < courseResults.length; i += 100) {
    await prisma.course.createMany({ data: courseResults.slice(i, i + 100) })
  }

  const reviews = [
    { comment: 'Excellent faculty and infrastructure. Great placement opportunities.', rating: 5 },
    { comment: 'Good campus life and research facilities.', rating: 4 },
    { comment: 'Supportive faculty but placement could be better.', rating: 4 },
    { comment: 'Amazing college with great hostel facilities.', rating: 5 },
    { comment: 'Moderate college with decent placements.', rating: 3 },
  ]

  const reviewResults: { collegeId: string; rating: number; comment: string }[] = []
  for (const college of collegeRecords) {
    const numReviews = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < numReviews; i++) {
      const review = reviews[Math.floor(Math.random() * reviews.length)]
      reviewResults.push({
        collegeId: college.id,
        rating: review.rating,
        comment: review.comment,
      })
    }
  }
  for (let i = 0; i < reviewResults.length; i += 100) {
    await prisma.review.createMany({ data: reviewResults.slice(i, i + 100) })
  }

  const cutoffs = [
    { exam: 'JEE Main', branch: 'Computer Science and Engineering', category: 'General', openingRank: 1000, closingRank: 5000, homeState: null },
    { exam: 'JEE Main', branch: 'Computer Science and Engineering', category: 'OBC', openingRank: 3000, closingRank: 8000, homeState: null },
    { exam: 'JEE Main', branch: 'Computer Science and Engineering', category: 'SC', openingRank: 5000, closingRank: 15000, homeState: null },
    { exam: 'JEE Main', branch: 'Computer Science and Engineering', category: 'ST', openingRank: 8000, closingRank: 25000, homeState: null },
    { exam: 'JEE Main', branch: 'Electronics and Communication Engineering', category: 'General', openingRank: 5000, closingRank: 12000, homeState: null },
    { exam: 'JEE Main', branch: 'Mechanical Engineering', category: 'General', openingRank: 10000, closingRank: 25000, homeState: null },
    { exam: 'JEE Main', branch: 'Electrical Engineering', category: 'General', openingRank: 12000, closingRank: 30000, homeState: null },
    { exam: 'JEE Main', branch: 'Civil Engineering', category: 'General', openingRank: 20000, closingRank: 50000, homeState: null },
    { exam: 'JEE Main', branch: 'Information Technology', category: 'General', openingRank: 6000, closingRank: 15000, homeState: null },
    { exam: 'JEE Main', branch: 'Computer Science and Engineering', category: 'General', openingRank: 3000, closingRank: 10000, homeState: 'Home State' },
    { exam: 'JEE Main', branch: 'Computer Science and Engineering', category: 'OBC', openingRank: 8000, closingRank: 18000, homeState: 'Home State' },
    { exam: 'JEE Main', branch: 'Computer Science and Engineering', category: 'SC', openingRank: 15000, closingRank: 40000, homeState: 'Home State' },
    { exam: 'JEE Main', branch: 'Computer Science and Engineering', category: 'ST', openingRank: 25000, closingRank: 60000, homeState: 'Home State' },
    { exam: 'JEE Advanced', branch: 'Computer Science and Engineering', category: 'General', openingRank: 1, closingRank: 1000, homeState: null },
    { exam: 'JEE Advanced', branch: 'Electronics and Communication Engineering', category: 'General', openingRank: 500, closingRank: 3000, homeState: null },
    { exam: 'JEE Advanced', branch: 'Mechanical Engineering', category: 'General', openingRank: 2000, closingRank: 8000, homeState: null },
    { exam: 'JEE Advanced', branch: 'Electrical Engineering', category: 'General', openingRank: 3000, closingRank: 10000, homeState: null },
    { exam: 'JEE Advanced', branch: 'Civil Engineering', category: 'General', openingRank: 5000, closingRank: 15000, homeState: null },
  ]

  const iitSlugs = [
    'iit-delhi',
    'iit-bombay',
    'iit-guwahati',
    'iit-kharagpur',
    'iit-madras',
    'iit-kanpur',
    'iit-roorkee',
    'iit-hyderabad',
    'iit-gandhinagar',
    'iit-indore',
  ]
  const nitSlugs = [
    'nit-trichy',
    'nit-rourkela',
    'nit-warangal',
    'nitk-surathkal',
    'nit-calicut',
    'nit-durgapur',
    'nit-patna',
    'nit-jamshedpur',
    'nit-kurukshetra',
    'svnit-surat',
    'vnit-nagpur',
    'manit-bhopal',
  ]
  const jeeMainColleges = [
    'iiit-delhi',
    'iiit-allahabad',
    'iiit-hyderabad',
    'dtu-delhi',
    'nsut-delhi',
    'iiest-shibpur',
    'pec-chandigarh',
    'coep-pune',
  ]

  const findColleges = (slugs: string[]) =>
    slugs
      .map((slug) => collegeRecords.find((c: { slug: string }) => c.slug === slug))
      .filter((c): c is (typeof collegeRecords)[number] => Boolean(c))

  const nitColleges = findColleges(nitSlugs)
  const iitColleges = findColleges(iitSlugs)
  const mainColleges = findColleges(jeeMainColleges)

  const cutoffData: { collegeId: string; exam: string; branch: string; category: string; openingRank: number; closingRank: number; homeState: string | null; year: number }[] = []

  for (const college of nitColleges) {
    for (const cutoff of cutoffs) {
      cutoffData.push({
        collegeId: college.id,
        exam: cutoff.exam,
        branch: cutoff.branch,
        category: cutoff.category,
        openingRank: cutoff.openingRank,
        closingRank: cutoff.closingRank,
        homeState: cutoff.homeState,
        year: 2024,
      })
    }
  }

  for (const college of iitColleges) {
    for (const cutoff of cutoffs) {
      cutoffData.push({
        collegeId: college.id,
        exam: cutoff.exam,
        branch: cutoff.branch,
        category: cutoff.category,
        openingRank: Math.floor(cutoff.openingRank / 10),
        closingRank: Math.floor(cutoff.closingRank / 5),
        homeState: cutoff.homeState,
        year: 2024,
      })
    }
  }

  for (const college of mainColleges) {
    for (const cutoff of cutoffs) {
      cutoffData.push({
        collegeId: college.id,
        exam: cutoff.exam,
        branch: cutoff.branch,
        category: cutoff.category,
        openingRank: Math.floor(cutoff.openingRank * 1.5),
        closingRank: Math.floor(cutoff.closingRank * 1.5),
        homeState: cutoff.homeState,
        year: 2024,
      })
    }
  }

  for (let i = 0; i < cutoffData.length; i += 100) {
    await prisma.cutoff.createMany({ data: cutoffData.slice(i, i + 100) })
  }

  await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@collegefinder.com',
      password: hashPassword('hashedpassword'),
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