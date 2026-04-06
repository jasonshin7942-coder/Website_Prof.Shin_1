// ============================================
// Content Data Access Layer
// This module serves as the single source of truth
// for accessing content data. Currently uses mock data,
// but can be swapped with database queries later.
// ============================================

// Re-export all functions from file storage
export {
  getProfile,
  updateProfile,
  getResearchList,
  getResearchById,
  createResearch,
  updateResearch,
  deleteResearch,
  getPublicationList,
  getPublicationById,
  createPublication,
  updatePublication,
  deletePublication,
  getTeachingList,
  getTeachingById,
  createTeaching,
  updateTeaching,
  deleteTeaching,
  getActivityList,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  getSettings,
  updateSettings,
  getDashboardStats,
} from '@/lib/fileStorage';
