const db = require("../models");
const Comment = db.comment;
const Task = db.task;
const Project = db.project;
const authJwt = require("../middleware/authJwt.js");

exports.findAll = (req, res) => {
  authJwt.verifyToken(req, res, () => {
    const authenticatedUsername = req.userId;
    Comment.findAll({
      where: { username: authenticatedUsername },
    })
      .then((data) => res.send(data))
      .catch((err) => {
        logger.error("Error retrieving comments:", err);
        res.status(500).send({
          message: "Internal server error while retrieving comments.",
        });
      });
  });
};

exports.create = (req, res) => {
  authJwt.verifyToken(req, res, () => {
    const authenticatedUsername = req.userId;
    if (!req.body.id) {
      const message = "Content can not be empty!";
      logger.error(message);
      res.status(400).send({
        message: message,
      });
      return;
    }

    const comment = {
      id: req.body.id,
      task_id: req.body.task_id,
      project_id: req.body.project_id,
      posted_at: req.body.posted_at ? req.body.posted_at : null,
      content: req.body.content,
      attachment: req.body.attachment ? req.body.attachment : null,
      username: authenticatedUsername,
    };

    Task.findByPk(comment.task_id)
      .then((task) => {
        if (task && task.username === authenticatedUsername) {
          return Comment.create(comment);
        } else {
          const message =
            "Task not found or does not belong to the authenticated user.";
          logger.error(message);
          throw new Error(message);
        }
      })
      .then((createdComment) => {
        return Task.findByPk(comment.task_id);
      })
      .then((task) => {
        if (task) {
          task.comment_count += 1;
          return task.save();
        } else {
          const message = "Task not found.";
          logger.error(message);
          throw new Error(message);
        }
      })
      .then((data) => {
        return Project.findByPk(comment.project_id);
      })
      .then((project) => {
        project.comment_count += 1;
        return project.save();
      })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        logger.error("Error creating comment:", err);
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Comment.",
        });
      });
  });
};

exports.update = (req, res) => {
  authJwt.verifyToken(req, res, () => {
    const authenticatedUsername = req.userId;
    const id = req.params.id;

    Comment.update(req.body, {
      where: { id: id, username: authenticatedUsername },
    })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "Comment was updated successfully.",
          });
        } else {
          const message = `Cannot update Comment with id=${id}. Maybe Comment was not found or does not belong to the authenticated user.`;
          logger.error(message);
          res.send({
            message: message,
          });
        }
      })
      .catch((err) => {
        logger.error("Error updating comment:", err);
        res.status(500).send({
          message: `Internal server error while updating Comment with id=${id}.`,
        });
      });
  });
};
exports.delete = (req, res) => {
  authJwt.verifyToken(req, res, () => {
    const authenticatedUsername = req.userId;

    const commentId = req.params.id;

    Comment.findByPk(commentId)
      .then((comment) => {
        if (!comment || comment.username !== authenticatedUsername) {
          const message = `Comment with id=${commentId} not found or does not belong to the authenticated user.`;
          logger.error(message);
          return res.status(404).send({
            message: message,
          });
        }

        const taskId = comment.task_id;

        Comment.destroy({
          where: { id: commentId, username: authenticatedUsername },
        })
          .then((numDeleted) => {
            if (numDeleted === 1) {
              Task.findByPk(taskId)
                .then((task) => {
                  if (task) {
                    task.comment_count = Math.max(0, task.comment_count - 1);
                    return task.save();
                  } else {
                    const message = `Associated Task with id=${taskId} not found.`;
                    logger.error(message);
                    return Promise.reject(message);
                  }
                })
                .catch((error) => {
                  logger.error(error);
                  res.send({
                    message: `Comment was deleted, but ${error}`,
                  });
                });
              Project.findByPk(comment.project_id)
                .then((project) => {
                  if (project) {
                    project.comment_count = Math.max(
                      0,
                      project.comment_count - 1
                    );
                    return project.save();
                  } else {
                    const message = `Associated Project with id=${comment.project_id} not found`;
                    logger.error(message);
                    return Promise.reject(message);
                  }
                })
                .then(() => {
                  res.send({
                    message: "Comment was deleted successfully!",
                  });
                });
            } else {
              const message = `Cannot delete Comment with id=${commentId}. Maybe Comment was not found...`;
              logger.error(message);
              res.send({
                message: message,
              });
            }
          })
          .catch((err) => {
            logger.error(err);
            res.status(500).send({
              message: `Error occurred while deleting Comment with id=${commentId}.`,
            });
          });
      })
      .catch((err) => {
        logger.error(err);
        const message = `Error occurred while finding Comment with id=${commentId}.`;
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

    Comment.findByPk(id)
      .then((data) => {
        if (data && data.username === authenticatedUsername) {
          res.send(data);
        } else {
          const message = `Cannot find Comment with id=${id} or it does not belong to the authenticated user.`;
          logger.error(message);
          res.status(404).send({
            message: message,
          });
        }
      })
      .catch((err) => {
        const message = "Error retrieving Comment with id=" + id;
        logger.error(message);
        res.status(500).send({
          message: message,
        });
      });
  });
};
