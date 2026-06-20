import { courseService } from '../services/course.service.js';

export const courseController = {
  getAll: (req, res) => {
    const courses = courseService.getAllCourses();
    res.json(courses);
  },

  getOne: (req, res, next) => {
    try {
      const course = courseService.getCourseById(req.params.id);
      res.json(course);
    } catch (error) {
      error.status = 404;
      next(error);
    }
  },

  create: (req, res, next) => {
    try {
      const course = courseService.createCourse(req.body);
      res.status(201).json(course);
    } catch (error) {
      next(error);
    }
  },

  update: (req, res, next) => {
    try {
      const course = courseService.updateCourse(req.params.id, req.body);
      res.json(course);
    } catch (error) {
      error.status = error.message.includes('not found') ? 404 : 400;
      next(error);
    }
  },

  remove: (req, res, next) => {
    try {
      courseService.deleteCourse(req.params.id);
      res.json({
        message: `Course with id ${req.params.id} has been successfully deleted`,
      });
    } catch (error) {
      error.status = 404;
      next(error);
    }
  },
};
