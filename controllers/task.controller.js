const db = require("../models");
const Task = db.task;
const authJwt = require("../middleware/authJwt.js");


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
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving Tasks.",
        });
      });
  });
};

exports.create = (req, res) => {
  authJwt.verifyToken(req, res, () => {
    const authenticatedUsername = req.userId;
    if (!req.body.id) {
      res.status(400).send({
        message: "Content can not be empty! 'id' is required.",
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
      username:authenticatedUsername
    };


    Task.create(task)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while creating the Task.",
        });
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
          res.status(404).send({
            message: `Cannot update Task with id=${id}. Maybe Task was not found or req.body is empty.`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating task with id=" + id,
        });
      });
  });
};


exports.delete = (req, res) => {
  authJwt.verifyToken(req, res, () => {
    const authenticatedUsername = req.userId;

    const id = req.params.id;
    if (!id) {
      return res.status(400).send({
        message: "Invalid request. Please provide a valid task ID.",
      });
    }

    Task.destroy({
      where: { id: id, username: authenticatedUsername },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Task was deleted successfully!",
          });
        } else {
          res.send({
            message: `Cannot delete task with id=${id}. Maybe task was not found or does not belong to the authenticated user.`,
          });
        }
      })
      .catch((err) => {
        console.error("Error deleting task:", err);
        res.status(500).send({
          message: "Internal server error while deleting the task.",
        });
      });
  });
};

exports.findOne = (req, res) => {
  authJwt.verifyToken(req, res, () => {
    const authenticatedUsername = req.userId;

    const id = req.params.id;
    if (!id) {
      return res.status(400).send({
        message: "Invalid request. Please provide a valid task ID.",
      });
    }
    Task.findOne({
      where: { id: id, username: authenticatedUsername, is_completed: false },
    })
      .then((data) => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find active task with id=${id} or task does not belong to the authenticated user.`,
          });
        }
      })
      .catch((err) => {
        console.error("Error retrieving task:", err);
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
      return res.status(400).send({
        message: "Invalid request. Please provide a valid task ID.",
      });
    }
    
    Task.findByPk(taskId)
      .then((task) => {
        if (!task || task.username !== authenticatedUsername) {
          return res.status(404).send({
            message: `Cannot find Task with id=${taskId} or Task does not belong to the authenticated user.`,
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
        console.error("Error toggling task status:", err);
        res.status(500).send({
          message: `Internal server error while toggling Task status with id=${taskId}.`,
        });
      });
  });
};
