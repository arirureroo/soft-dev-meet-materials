import { courseService } from "../services/course.service.js";

export const courseController = {
  getAll: (req, res) => {
    const courses = courseService.getAllCourses();
    res.json(courses);
  },

  getOne: (req, res) => {
    try {
      const course = courseService.getCourseById(req.params.id);
      res.json(course);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  create: (req, res) => {
    try {
      const course = courseService.createCourse(req.body);
      res.status(201).json(course);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  update: (req, res) => {
    try {
      const course = courseService.updateCourse(req.params.id, req.body);
      res.json(course);
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 400;
      res.status(status).json({ error: error.message });
    }
  },

  remove: (req, res) => {
    try {
      courseService.deleteCourse(req.params.id);
      res.json({
        message: `Course with id ${req.params.id} has been successfully deleted`,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },
};
