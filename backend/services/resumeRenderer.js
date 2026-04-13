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
  const templatePath = path.join(__dirname, '../templates/resume_stone.html')
  const templateHtml = fs.readFileSync(templatePath, 'utf8')
  const template = handlebars.compile(templateHtml)

  const { experience, projects, github, profile } = data

  const mainExperience = experience[0] || {}
  
  const mainEducation = {
    degree: mainExperience.degree,
    college: mainExperience.college,
    graduationYear: mainExperience.graduationYear
  }

  let jobs = Array.isArray(mainExperience.workExperiences) ? mainExperience.workExperiences : []
  
  // Backwards compatibility for single old flat entry
  if (jobs.length === 0 && mainExperience.currentRole) {
    jobs = [{
      currentRole: mainExperience.currentRole,
      company: mainExperience.company,
      startDate: mainExperience.startDate,
      endDate: mainExperience.endDate,
      currentlyWorking: mainExperience.currentlyWorking,
      experienceType: mainExperience.experienceType,
      headline: mainExperience.headline
    }]
  }

  // 2. Skill Management
  let allSkills = github.languages || []
  if (allSkills.length === 0 && projects.length > 0) {
    const projectTags = new Set()
    projects.forEach(p => p.tags && p.tags.forEach(t => projectTags.add(t)))
    allSkills = Array.from(projectTags)
  }

  const renderData = {
    ...data,
    experience: {
      ...mainEducation, // degree, college, graduationYear
      jobs: jobs
    },
    skills: allSkills.slice(0, 15),
    hasJobs: jobs.length > 0,
    hasProjects: projects.length > 0,
    generatedDate: new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  return template(renderData)
}

module.exports = { renderResume }
