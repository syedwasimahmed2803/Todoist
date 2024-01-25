const db = require("../models");
const Task = db.task;
const authJwt = require("../middleware/authJwt.js");
const logger = require("../logger/index.js");

exports.findAll = (req, res) => {
  authJwt.verifyToken(req, res, () => {
    const authenticatedUsername = req.userId;

    Task.findAll({
      where: {
        is_completed: false,
        username: authenticatedUsername,
      },
    })
      .then((data) => res.send(data))
      .catch((err) => {
        const message = "Some error occurred while retrieving Tasks.";
        logger.error(message);
        res.status(500).send({
          message: err.message || message,
        });
      });
  });
};

exports.create = (req, res) => {
  authJwt.verifyToken(req, res, () => {
    const authenticatedUsername = req.userId;
    const message = "Content can not be empty! 'id' is required.";
    if (!req.body.id) {
      logger.error(message);
      res.status(400).send({
        message: message,
      });
      return;
    }
    const task = {
      id: req.body.id,
      project_id: req.body.project_id,
      section_id: req.body.section_id || null,
      content: req.body.content,
      description: req.body.description,
      is_completed: req.body.is_completed || false,
      labels: req.body.labels || [],
      parent_id: req.body.parent_id || null,
      order: req.body.order || null,
      priority: req.body.priority || null,
      due: req.body.due || {},
      url: req.body.url || null,
      comment_count: req.body.comment_count || 0,
      created_at: req.body.created_at || 0,
      creator_id: req.body.creator_id || 0,
      assignee_id: req.body.assignee_id || 0,
      assigner_id: req.body.assigner_id || 0,
      duration: req.body.duration || {},
      username: authenticatedUsername,
    };

    Task.create(task)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        const message = "Some error occurred while creating the Task.";
        res.status(500).send({
          message: err.message || message,
        });

        logger.error(message);
      });
  });
};

exports.update = (req, res) => {
  authJwt.verifyToken(req, res, () => {
    const authenticatedUsername = req.userId;

    const id = req.params.id;

    Task.update(req.body, {
      where: { id: id, username: authenticatedUsername },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Task was updated successfully.",
          });
        } else {
          const message = `Cannot update Task with id=${id}. Maybe Task was not found or req.body is empty.`;
          res.status(404).send({
            message: message,
          });
          logger.error(message);
        }
      })
      .catch((err) => {
        const message = "Error updating task with id=" + id;
        res.status(500).send({
          message: message,
        });
        logger.error(message);
      });
  });
};

exports.delete = (req, res) => {
  authJwt.verifyToken(req, res, () => {
    const authenticatedUsername = req.userId;

    const id = req.params.id;
    if (!id) {
      const message = "Invalid request. Please provide a valid task ID.";
      logger.error(message);
      return res.status(400).send({
        message: message,
      });
    }

    Task.destroy({
      where: { id: id, username: authenticatedUsername },
    })
      .then((num) => {
        if (num == 1) {
          const message = "Task was deleted successfully!";
          res.send({
            message: message,
          });
          logger.error(message);
        } else {
          const message = `Cannot delete task with id=${id}. Maybe task was not found or does not belong to the authenticated user.`;
          res.send({
            message: message,
          });
          logger.error(message);
        }
      })
      .catch((err) => {
        const message = "Error deleting task:";
        logger.error(message, err);
        res.status(500).send({
          message: message,
        });
      });
  });
};

exports.findOne = (req, res) => {
  authJwt.verifyToken(req, res, () => {
    const authenticatedUsername = req.userId;

    const id = req.params.id;
    if (!id) {
      const message = "Invalid request. Please provide a valid task ID.";
      logger.error(message);
      return res.status(400).send({
        message: message,
      });
    }
    Task.findOne({
      where: { id: id, username: authenticatedUsername, is_completed: false },
    })
      .then((data) => {
        if (data) {
          res.send(data);
        } else {
          const message = `Cannot find active task with id=${id} or task does not belong to the authenticated user.`;
          res.status(404).send({
            message: message,
          });
          logger.error(message);
        }
      })
      .catch((err) => {
        const message = "Internal server error while retrieving the task.";
        logger.error(message, err);
        res.status(500).send({
          message: "Internal server error while retrieving the task.",
        });
      });
  });
};

exports.toggle = (req, res) => {
  authJwt.verifyToken(req, res, () => {
    const authenticatedUsername = req.userId;

    const taskId = req.params.id;

    if (!taskId) {
      const message = "Invalid request. Please provide a valid task ID.";
      logger.error(message);
      return res.status(400).send({
        message: message,
      });
    }

    Task.findByPk(taskId)
      .then((task) => {
        const message = `Cannot find Task with id=${taskId} or Task does not belong to the authenticated user.`;
        if (!task || task.username !== authenticatedUsername) {
          logger.error(message);
          return res.status(404).send({
            message: message,
          });
        }

        const newStatus = !task.is_completed;

        return Task.update(
          { is_completed: newStatus },
          {
            where: {
              id: taskId,
              username: authenticatedUsername,
            },
          }
        );
      })
      .then(() => {
        res.status(201).send({
          message: "Task status is updated.",
        });
      })
      .catch((err) => {
        logger.error("Error toggling task status:", err);
        const message = `Internal server error while toggling Task status with id=${taskId}.`;
        res.status(500).send({
          message: message,
        });
      });
  });
};
