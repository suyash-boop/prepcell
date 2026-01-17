import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a default user for seeding
  const user = await prisma.user.upsert({
    where: { email: 'demo@prepcell.com' },
    update: {},
    create: {
      email: 'demo@prepcell.com',
      name: 'Demo User',
    },
  })

  console.log('Created/found user:', user)

  const categories = [
    {
      name: 'Aptitude',
      order: 1,
      skills: [
        { name: 'Quantitative Aptitude' },
        { name: 'Logical Reasoning' },
        { name: 'Verbal Ability' },
        { name: 'Data Interpretation' },
        { name: 'Analytical Reasoning' },
        { name: 'Number Series' },
        { name: 'Blood Relations' },
        { name: 'Coding-Decoding' },
      ],
    },
    {
      name: 'Data Structures',
      order: 2,
      skills: [
        { name: 'Arrays' },
        { name: 'Linked Lists' },
        { name: 'Stacks & Queues' },
        { name: 'Trees' },
        { name: 'Graphs' },
        { name: 'Hashing' },
        { name: 'Heaps' },
        { name: 'Tries' },
        { name: 'Segment Trees' },
        { name: 'Binary Search Trees' },
      ],
    },
    {
      name: 'Algorithms',
      order: 3,
      skills: [
        { name: 'Sorting Algorithms' },
        { name: 'Searching Algorithms' },
        { name: 'Dynamic Programming' },
        { name: 'Greedy Algorithms' },
        { name: 'Backtracking' },
        { name: 'Divide and Conquer' },
        { name: 'Graph Algorithms' },
        { name: 'Bit Manipulation' },
        { name: 'Recursion' },
        { name: 'Two Pointers' },
        { name: 'Sliding Window' },
      ],
    },
    {
      name: 'Core Subjects',
      order: 4,
      skills: [
        { name: 'Operating Systems' },
        { name: 'Database Management Systems' },
        { name: 'Computer Networks' },
        { name: 'Object-Oriented Programming' },
        { name: 'System Design' },
        { name: 'Software Engineering' },
        { name: 'Compiler Design' },
        { name: 'Theory of Computation' },
        { name: 'Computer Architecture' },
      ],
    },
    {
      name: 'Programming Languages',
      order: 5,
      skills: [
        { name: 'Java' },
        { name: 'Python' },
        { name: 'C++' },
        { name: 'JavaScript' },
        { name: 'TypeScript' },
        { name: 'C' },
        { name: 'Go' },
        { name: 'Rust' },
      ],
    },
    {
      name: 'Web Development',
      order: 6,
      skills: [
        { name: 'HTML/CSS' },
        { name: 'React' },
        { name: 'Node.js' },
        { name: 'Express.js' },
        { name: 'Next.js' },
        { name: 'REST APIs' },
        { name: 'GraphQL' },
        { name: 'MongoDB' },
        { name: 'PostgreSQL' },
      ],
    },
    {
      name: 'DevOps & Tools',
      order: 7,
      skills: [
        { name: 'Git & GitHub' },
        { name: 'Docker' },
        { name: 'Kubernetes' },
        { name: 'CI/CD' },
        { name: 'AWS' },
        { name: 'Linux Commands' },
        { name: 'Testing (Unit/Integration)' },
      ],
    },
    {
      name: 'Soft Skills',
      order: 8,
      skills: [
        { name: 'Communication Skills' },
        { name: 'Problem Solving' },
        { name: 'Teamwork' },
        { name: 'Time Management' },
        { name: 'Leadership' },
        { name: 'Critical Thinking' },
        { name: 'Adaptability' },
        { name: 'Presentation Skills' },
      ],
    },
    {
      name: 'Advanced Topics',
      order: 9,
      skills: [
        { name: 'Machine Learning' },
        { name: 'Deep Learning' },
        { name: 'Natural Language Processing' },
        { name: 'Computer Vision' },
        { name: 'Blockchain' },
        { name: 'Cybersecurity' },
        { name: 'Cloud Computing' },
        { name: 'Microservices Architecture' },
      ],
    },
  ]

  // Delete existing skill categories for this user to avoid duplicates
  await prisma.skillCategory.deleteMany({
    where: { userId: user.id },
  })

  for (const category of categories) {
    await prisma.skillCategory.create({
      data: {
        name: category.name,
        order: category.order,
        userId: user.id, // Add userId
        skills: {
          create: category.skills,
        },
      },
    })
  }

  console.log('Seeded skill categories and skills')

  // Seed some sample companies
  await prisma.company.deleteMany({
    where: { userId: user.id },
  })

  const companies = [
    {
      name: 'Google',
      examPattern: 'Online Assessment\nTechnical Phone Screen\nOnsite Interviews (4-5 rounds)\nHiring Committee Review',
      importantTopics: 'Data Structures, Algorithms, System Design, Problem Solving',
      notes: 'Difficulty: Hard\n\nApproximate LeetCode Problems: 200+\n\nCommon Questions:\n- Implement LRU Cache\n- Design URL Shortener\n- Two Sum variants\n\nPreparation Tips:\nFocus on problem-solving skills and clean code. Practice whiteboard coding.',
    },
    {
      name: 'Microsoft',
      examPattern: 'Online Assessment\nTechnical Interview\nManagerial Round\nHR Round',
      importantTopics: 'Data Structures, Algorithms, System Design, Databases',
      notes: 'Difficulty: Medium to Hard\n\nApproximate LeetCode Problems: 150+\n\nCommon Questions:\n- Merge Intervals\n- Binary Tree Traversal\n- Design Patterns\n\nPreparation Tips:\nRevise core CS subjects and practice system design questions. Mock interviews are highly recommended.',
    },
    {
      name: 'Amazon',
      examPattern: 'Online Assessment\nTechnical Interview\nBar Raiser Interview\nHR Interview',
      importantTopics: 'Data Structures, Algorithms, System Design, AWS Basics',
      notes: 'Difficulty: Medium\n\nApproximate LeetCode Problems: 100+\n\nCommon Questions:\n- Find the Kth Largest Element\n- Implement Trie\n- Design a Parking System\n\nPreparation Tips:\nUnderstand Amazon\'s leadership principles. Be ready to discuss past projects and decisions.',
    },
    {
      name: 'Facebook',
      examPattern: 'Online Assessment\nTechnical Phone Interview\nOnsite Interviews (4 rounds)\nReference Check',
      importantTopics: 'Data Structures, Algorithms, System Design, Databases, Networking',
      notes: 'Difficulty: Hard\n\nApproximate LeetCode Problems: 200+\n\nCommon Questions:\n- Longest Substring Without Repeating Characters\n- Design a Social Network\n- Cache System Design\n\nPreparation Tips:\nDeep dive into system design and scalability issues. Be prepared for behavioral questions as well.',
    },
    {
      name: 'Apple',
      examPattern: 'Online Assessment\nTechnical Interview\nSystem Design Interview\nHR Interview',
      importantTopics: 'Data Structures, Algorithms, System Design, iOS Development Basics',
      notes: 'Difficulty: Medium to Hard\n\nApproximate LeetCode Problems: 150+\n\nCommon Questions:\n- Rotate Array\n- Design a URL Shortener\n- iOS App Architecture\n\nPreparation Tips:\nBrush up on iOS fundamentals if applying for a mobile position. Focus on clean, maintainable code.',
    },
  ]

  for (const company of companies) {
    await prisma.company.create({
      data: {
        name: company.name,
        examPattern: company.examPattern,
        importantTopics: company.importantTopics,
        notes: company.notes,
        userId: user.id, // Associate with the demo user
      },
    })
  }

  console.log('Seeded sample companies')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })