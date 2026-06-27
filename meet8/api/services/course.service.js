import { courseDao } from '../daos/course.dao.js';

export const courseService = {
  getAllCourses: () => {
    return courseDao.findAll();
  },

  getCourseById: (id) => {
    const course = courseDao.findById(id);
    if (!course) throw new Error(`Course with id ${id} not found`);
    return course;
  },

  createCourse: (data) => {
    return courseDao.create(data);
  },

  updateCourse: (id, partialData) => {
    const existing = courseDao.findById(id);
    if (!existing) throw new Error(`Course with id ${id} not found`);
    const merged = { ...existing, ...partialData };
    return courseDao.update(id, merged);
  },

  deleteCourse: (id) => {
    const course = courseDao.findById(id);
    if (!course) throw new Error(`Course with id ${id} not found`);
    courseDao.delete(id);
  },
};
