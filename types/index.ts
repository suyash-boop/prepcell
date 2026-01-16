import { Prisma } from "@prisma/client"

export type SkillCategory = Prisma.SkillCategoryGetPayload<{
  include: { skills: true }
}>

export type Skill = Prisma.SkillGetPayload<{}>

export type Company = Prisma.CompanyGetPayload<{}>

export type Goal = Prisma.GoalGetPayload<{}>

export type Resume = Prisma.ResumeGetPayload<{}>