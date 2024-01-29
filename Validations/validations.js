const yup = require("yup");

const signupSchema = yup.object({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).max(20).required(),
});

const signinSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
});

const createProjectSchema = yup.object({
  name: yup.string().required(),
});

const createTaskSchema = yup.object({
  project_id: yup.string().required(),
  content: yup.string().required(),
  description: yup.string().required(),
});

const createCommentSchema = yup.object({
  task_id: yup.string().required(),
  project_id: yup.string().required(),
  content: yup.string().required(),
});

const createLabelSchema = yup.object({
  name: yup.string().required(),
  task_id: yup.string().required(),
});
const deleteLabelSchema = yup.object({
  task_id: yup.string().required(),
});

module.exports = createTaskSchema;
module.exports = createProjectSchema;
module.exports = {
  signupSchema,
  signinSchema,
  createProjectSchema,
  createTaskSchema,
  createCommentSchema,
  createLabelSchema,
  deleteLabelSchema,
};
