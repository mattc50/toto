import Todo from '../models/Todo.js'
import User from '../models/User.js'
import Set from '../models/Set.js'
import { StatusCodes } from 'http-status-codes'
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError
} from '../errors/index.js'
import moment from 'moment'

import { updateTodo } from '../controllers/todoController.js'
import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId;

const createSet = async (req, res) => {



  // THE BELOW CODE WORKS FOR PASSING ID STRINGS INTO POSTMAN.
  // this may not be the final implementation.
  const { todos } = req.body;

  // Assign the array of todo references (ids) to req.body.todos
  req.body.todos = todos;

  // Fetch the Todo objects from the database using the _id values
  const todoObjects = await Todo.find({ _id: { $in: todos } });

  // Create an array of todo references with the fetched Todo objects
  // const todoReferences = todoObjects.map(todo => ({
  //   _id: todo._id,
  //   task: todo.task,
  //   status: todo.status,
  //   createdBy: todo.createdBy
  // }));

  // Assign the todoReferences array to req.body.todos
  // req.body.todos = todoObjects;

  // Assign createdBy based on req.user.userId
  req.body.createdBy = req.user.userId;

  const set = await Set.create(req.body);

  res.status(StatusCodes.CREATED).json({ set });
}

const getSets = async (req, res) => {
  const userQuery = { createdBy: req.user.userId }
  const result = await Set.find(userQuery)
  const sets = await result;

  res.status(StatusCodes.OK).json({ sets })
}

const getSet = async (req, res) => {
  const { id: setId } = req.params;
  // const set = await Set.findOne({ _id: setId })
  // if (!ObjectId.isValid(setId)) {
  //   // Invalid ObjectId
  //   throw new NotFoundError('Invalid Set ID');
  // }

  // const getSet = await Set.findById({ _id: setId });

  // if (!getSet) {
  //   // Set not found in the database
  //   throw new NotFoundError('Set not found');
  // }

  // if (getSet.createdBy._id !== req.user.userId) {
  //   throw new NotFoundError('Set not found');
  // }

  const set = await Set.findOne({ _id: setId, createdBy: req.user.userId })

  res.status(StatusCodes.OK).json({ set })
}

const updateSet = async (req, res) => {
  const { id: setId } = req.params;

  const set = await Set.findOne({ _id: setId })
  if (!set) {
    throw new BadRequestError(`No set with id ${setId}`)
  }

  const updatedSet = await (Set.findOneAndUpdate({ _id: setId }, req.body, {
    new: true,
    runValidators: true
  }))
  res.status(StatusCodes.OK).json({ updatedSet })
}

const deleteSet = async (req, res) => {
  const { id: setId } = req.params;
  const set = await Set.findOne({ _id: setId });
  if (!set) {
    throw new NotFoundError(`No set with id ${setId}`);
  };

  const session = await mongoose.startSession();

  session.withTransaction(async () => {
    await set.deleteOne();

    // functionality of deleteTodos in todoController.js, now moved here to be 
    // within the same transaction.
    await Todo.deleteMany({ belongsTo: { $in: [setId] } })
  });

  await session.endSession();

  res.status(StatusCodes.OK).json({ msg: 'Success! Set and related Todos removed' })
}

export {
  createSet, getSets, getSet, updateSet, deleteSet
}