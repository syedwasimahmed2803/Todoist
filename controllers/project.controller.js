const db = require("../models");
const Project = db.project;
const authJwt = require("../middleware/authJwt.js");
const logger = require("../logger/index.js");

exports.findAll = (req, res) => {
  authJwt.verifyToken(req, res, () => {
    Project.findAll({ where: { username: req.userId } })
      .then((data) => res.send(data))
      .catch((err) => {
        const message = "Some error occurred while retrieving Projects.";
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
    if (!req.body.id) {
      const message = "Content can not be empty!";
      logger.error(message);
      res.status(400).send({
        message: message,
      });
      return;
    }

    const project = {
      id: req.body.id,
      name: req.body.name,
      comment_count: req.body.comment_count ? req.body.comment_count : 0,
      order: req.body.order ? req.body.order : 0,
      color: req.body.color ? req.body.color : "Black",
      is_shared: req.body.is_shared ? req.body.is_shared : false,
      is_favorite: req.body.is_favorite ? req.body.is_favorite : false,
      is_inbox_project: req.body.is_inbox_project
        ? req.body.is_inbox_project
        : false,
      is_team_inbox: req.body.is_team_inbox ? req.body.is_team_inbox : false,
      view_style: req.body.view_style ? req.body.view_style : "list",
      url: req.body.url ? req.body.url : null,
      parent_id: req.body.parent_id ? req.body.parent_id : null,
      username: authenticatedUsername,
    };

    Project.create(project)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        const message = "Some error occurred while creating the Project.";
        logger.error(message);
        res.status(500).send({
          message: err.message || message,
        });
      });
  });
};

exports.update = (req, res) => {
  authJwt.verifyToken(req, res, () => {
    const authenticatedUsername = req.userId;

    const id = req.params.id;

    Project.findOne({
      where: { id: id, username: authenticatedUsername },
    })
      .then((project) => {
        if (!project) {
          const message = `Cannot update Project with id=${id}. Project not found for the authenticated user.`;
          logger.error(message);
          res.status(404).send({
            message: message,
          });
        } else {
          Project.update(req.body, {
            where: { id: id, username: authenticatedUsername },
          })
            .then((num) => {
              if (num == 1) {
                res.send({
                  message: "Project was updated successfully.",
                });
              } else {
                const message = `Cannot update Project with id=${id}. Maybe Project was not found or req.body is empty.`;
                logger.error(message);
                res.send({
                  message: message,
                });
              }
            })
            .catch((err) => {
              const message = "Error updating Project with id=" + id;
              logger.error(message);
              res.status(500).send({
                message: message,
              });
            });
        }
      })
      .catch((err) => {
        const message = "Error finding Project for update with id=" + id;
        logger.error(message);
        res.status(500).send({
          message: message,
        });
      });
  });
};

exports.delete = (req, res) => {
  authJwt.verifyToken(req, res, () => {
    const authenticatedUsername = req.userId;

    const id = req.params.id;

    Project.findOne({
      where: { id: id, username: authenticatedUsername },
    })
      .then((project) => {
        if (!project) {
          const message = `Cannot delete Project with id=${id}. Project not found for the authenticated user.`;
          logger.error(message);
          res.status(404).send({
            message: message,
          });
        } else {
          Project.destroy({
            where: { id: id, username: authenticatedUsername },
          })
            .then((num) => {
              if (num == 1) {
                res.send({
                  message: "Project was deleted successfully!",
                });
              } else {
                const message = `Cannot delete Project with id=${id}. Maybe Project was not Found...`;
                logger.error(message);
                res.send({
                  message: message,
                });
              }
            })
            .catch((err) => {
              const message = "Could not delete Project with id=" + id;
              logger.error(message);
              res.status(500).send({
                message: message,
              });
            });
        }
      })
      .catch((err) => {
        const message = "Error finding Project for deletion with id=" + id;
        logger.error(message);

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

    Project.findOne({
      where: { id: id, username: authenticatedUsername },
    })
      .then((data) => {
        if (data) {
          res.send(data);
        } else {
          const message = `Cannot find Project with id=${id}. Project not found for the authenticated user.`;
          logger.error(message);
          res.status(404).send({
            message: message,
          });
        }
      })
      .catch((err) => {
        const message = "Error retrieving Project with id=" + id;
        logger.error(message);
        res.status(500).send({
          message: message,
        });
      });
  });
};
