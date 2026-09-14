import type { Candidate, Job } from './objects.ts'
import type { ExperienceLevel } from './types.ts'

// Esto no estaba dentro de la consigna pero me parece una buena obserrvación que te quiero dejar para usar Record y para prescindir del uso de ternarias.
const REQUIRED_YEARS: Record<ExperienceLevel, number> = {
  junior: 0,
  mid: 2,
  senior: 5,
  lead: 8,
}

// Validar candidato para un empleo
export function isQualified(candidate: Candidate, job: Job): boolean {
  // Verificar años de experiencia
  const requiredYears = REQUIRED_YEARS[job.experienceLevel]

  if (candidate.experienceYears < requiredYears) {
    return false
  }

  // Verificar si tiene al menos una tecnología requerida
  const hasRequiredSkill = job.technologies.some((tech) => candidate.skills.includes(tech))

  return hasRequiredSkill
}

// Función con type guards - formatear salario
export function formatSalary(salary?: number): string {
  if (salary === undefined) {
    return 'Salario no especificado'
  }

  return `€${salary.toLocaleString()}`
}

// Validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
