const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')

// Register a basic 'eq' helper for conditional logic in templates
handlebars.registerHelper('eq', function (a, b) {
  return a === b
})

/**
 * Renders the resume HTML based on user data.
 * @param {Object} data - Aggregated data from resumeData service
 * @returns {string} Fully rendered HTML string
 */
const renderResume = (data) => {
  const templatePath = path.join(__dirname, '../templates/resume_bento.html')
  const templateHtml = fs.readFileSync(templatePath, 'utf8')
  const template = handlebars.compile(templateHtml)

  const { experience, projects, github, profile } = data

  // 1. Split Experience into Jobs and Education
  // Logic: Items with status 'student' or having 'degree'/'college' go to education.
  // Items with status 'experience' or having 'currentRole'/'company' go to jobs.
  const education = experience.filter(exp => 
    exp.status === 'student' || (!exp.currentRole && exp.degree)
  )
  const jobs = experience.filter(exp => 
    exp.status === 'experience' || exp.currentRole
  )

  // 2. Skill Management: Split into Main and Secondary
  let allSkills = github.languages || []
  
  // If github languages are empty, try to extract from project tags
  if (allSkills.length === 0 && projects.length > 0) {
    const projectTags = new Set()
    projects.forEach(p => p.tags && p.tags.forEach(t => projectTags.add(t)))
    allSkills = Array.from(projectTags)
  }

  const mainSkills = allSkills.slice(0, 10)
  const secondarySkills = allSkills.slice(10, 20)

  const renderData = {
    ...data,
    education,
    jobs,
    skills: mainSkills,
    secondarySkills
  }

  return template(renderData)
}

module.exports = { renderResume }
