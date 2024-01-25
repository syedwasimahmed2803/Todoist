const db = require("../models");
const Label = db.label;
const Task = db.task;
const authJwt = require("../middleware/authJwt.js");
const logger = require("../logger/index.js");

exports.findAll = (req, res) => {
  authJwt.verifyToken(req, res, () => {
    const authenticatedUsername = req.userId;

    Label.findAll({ where: { username: authenticatedUsername } })
      .then((data) => res.send(data))
      .catch((err) => {
        logger.error(err);
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Labels.",
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
    const label = {
      id: req.body.id,
      name: req.body.name,
      color: req.body.color ? req.body.color : "black",
      order: req.body.order ? req.body.order : null,
      is_favorite: req.body.is_favorite ? req.body.is_favorite : false,
      username: authenticatedUsername,
    };

    Label.create(label)
      .then((createdLabel) => {
        return Task.findByPk(req.body.task_id);
      })
      .then((task) => {
        if (task && task.username === authenticatedUsername) {
          task.labels = task.labels || [];
          task.labels.push(label.name);
          task.changed("labels", true);
          return task.save();
        } else {
          const message = "Task Not Found or Unauthorized";
          logger.error(message);
          throw new Error(message);
        }
      })
      .then((updatedTask) => {
        res.send(updatedTask);
      })
      .catch((err) => {
        logger.error(err);
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Label.",
        });
      });
  });
};

exports.update = (req, res) => {
  const id = req.params.id;

  authJwt.verifyToken(req, res, () => {
    const authenticatedUsername = req.userId;

    Label.update(req.body, {
      where: { id: id },
    })
      .then((num) => {
        if (num == 1) {
          return Label.findByPk(id);
        } else {
          const message = `Cannot update Label with id=${id}. Maybe Label was not found or req.body is empty !!!`;
          logger.error(message);
          throw new Error(message);
        }
      })
      .then((updatedLabel) => {
        if (updatedLabel && updatedLabel.username === authenticatedUsername) {
          res.send({
            message: "Label was updated successfully....",
          });
        } else {
          const message = "Label Not Found or Unauthorized";
          logger.error(message);
          throw new Error(message);
        }
      })
      .catch((err) => {
        logger.error(err);
        res.status(500).send({
          message: err.message || `Error updating Label with id=${id}`,
        });
      });
  });
};

exports.delete = (req, res) => {
  const labelId = req.params.id;
  const taskId = req.body.task_id; // Make sure to have task_id available in your request body

  authJwt.verifyToken(req, res, () => {
    Label.findOne({ where: { id: labelId } })
      .then((label) => {
        if (!label) {
          const message = `Label with id=${labelId} not found.`;
          logger.error(message);
          return res.status(404).send({
            message: message,
          });
        }

        const labelName = label.name;

        Label.destroy({ where: { id: labelId } })
          .then((numDeleted) => {
            if (numDeleted === 1) {
              Task.findOne({ where: { id: taskId } })
                .then((task) => {
                  if (task && task.username === req.userId) {
                    task.labels = task.labels.filter(
                      (name) => name !== labelName
                    );
                    return task.save();
                  } else {
                    const message = `Associated Task with id=${taskId} not found or unauthorized.`;
                    logger.error(message);
                    return Promise.reject(message);
                  }
                })
                .then(() => {
                  const message = "Label was deleted successfully!";
                  res.send({
                    message: message,
                  });
                })
                .catch((error) => {
                  const message = `Label was deleted, but ${error}`;
                  logger.error(message);
                  res.send({
                    message: message,
                  });
                });
            } else {
              const message = `Cannot delete Label with id=${labelId}. Maybe Label was not found...`;
              logger.error(message);
              res.send({
                message: message,
              });
            }
          })
          .catch((err) => {
            logger.error(err);
            res.status(500).send({
              message: `Error occurred while deleting Label with id=${labelId}.`,
            });
          });
      })
      .catch((err) => {
        const message = `Error occurred while finding Label with id=${labelId}.`;
        logger.error(message);
        res.status(500).send({
          message: message,
        });
      });
  });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  authJwt.verifyToken(req, res, () => {
    Label.findByPk(id)
      .then((label) => {
        if (label && label.username === req.userId) {
          res.send(label);
        } else {
          const message = `Cannot find Label with id=${id} or unauthorized.`;
          logger.error(message);
          res.status(404).send({
            message: message,
          });
        }
      })
      .catch((err) => {
        const message = "Error retrieving Label with id=" + id;
        logger.error(message);
        res.status(500).send({
          message: message,
        });
      });
  });
};
