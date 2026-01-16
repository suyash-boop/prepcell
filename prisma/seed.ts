import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = [
    {
      name: 'Aptitude',
      order: 1,
      skills: [
        'Quantitative Aptitude',
        'Logical Reasoning',
        'Verbal Ability',
        'Data Interpretation',
      ],
    },
    {
      name: 'DSA',
      order: 2,
      skills: [
        'Arrays & Strings',
        'Linked Lists',
        'Trees & Graphs',
        'Dynamic Programming',
        'Sorting & Searching',
        'Recursion & Backtracking',
      ],
    },
    {
      name: 'Core Subjects',
      order: 3,
      skills: [
        'Operating Systems',
        'DBMS',
        'Computer Networks',
        'OOP Concepts',
        'System Design Basics',
      ],
    },
    {
      name: 'Soft Skills',
      order: 4,
      skills: [
        'Communication',
        'Group Discussion',
        'Mock Interviews',
        'Resume Building',
      ],
    },
  ]

  for (const category of categories) {
    await prisma.skillCategory.create({
      data: {
        name: category.name,
        order: category.order,
        skills: {
          create: category.skills.map((skill) => ({ name: skill })),
        },
      },
    })
  }

  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })