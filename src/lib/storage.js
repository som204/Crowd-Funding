// Simple local storage wrapper for data persistence
const STORAGE_KEYS = {
  USERS: 'crowdfund_users',
  PROJECTS: 'crowdfund_projects',
  PLEDGES: 'crowdfund_pledges',
  CURRENT_USER: 'crowdfund_current_user'
}

// Initialize storage with default data if empty
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.PLEDGES)) {
    localStorage.setItem(STORAGE_KEYS.PLEDGES, JSON.stringify([]))
  }
}

initializeStorage()

// User management
export const auth = {
  getCurrentUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    return user ? JSON.parse(user) : null
  },

  signUp: (email, password) => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS))
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists')
    }
    
    const newUser = {
      id: crypto.randomUUID(),
      email,
      password, 
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
    return { user: { ...newUser, password: undefined } }
  },

  signIn: (email, password) => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS))
    const user = users.find(u => u.email === email && u.password === password)
    
    if (!user) {
      throw new Error('Invalid credentials')
    }
    
    const userWithoutPassword = { ...user, password: undefined }
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword))
    return { user: userWithoutPassword }
  },

  signOut: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}

// Project management
export const projects = {
  create: (projectData) => {
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS))
    const newProject = {
      id: crypto.randomUUID(),
      ...projectData,
      current_amount: 0,
      backer_count: 0,
      created_at: new Date().toISOString(),
      status: 'active'
    }
    
    projects.push(newProject)
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects))
    return newProject
  },

  getAll: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS))
  },

  getById: (id) => {
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS))
    return projects.find(p => p.id === id)
  },

  getByCreator: (creatorId) => {
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS))
    return projects.filter(p => p.creator_id === creatorId)
  }
}

// Pledge management
export const pledges = {
  create: (pledgeData) => {
    const pledges = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLEDGES))
    const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS))
    
    const newPledge = {
      id: crypto.randomUUID(),
      ...pledgeData,
      created_at: new Date().toISOString(),
      status: 'completed'
    }
    
    // Update project stats
    const project = projects.find(p => p.id === pledgeData.project_id)
    if (project) {
      project.current_amount += parseFloat(pledgeData.amount)
      project.backer_count += 1
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects))
    }
    
    pledges.push(newPledge)
    localStorage.setItem(STORAGE_KEYS.PLEDGES, JSON.stringify(pledges))
    return newPledge
  },

  getByBacker: (backerId) => {
    const pledges = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLEDGES))
    return pledges.filter(p => p.backer_id === backerId)
  },

  getByProject: (projectId) => {
    const pledges = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLEDGES))
    return pledges.filter(p => p.project_id === projectId)
  }
}