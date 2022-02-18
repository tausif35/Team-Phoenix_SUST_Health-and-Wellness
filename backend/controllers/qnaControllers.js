const Question = require("../models/questionModel");
const Answer = require("../models/answerModel");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");

// return next(
//   new HttpError(
//     'Invalid inputs passed, please check your data',
//     422
//   )
// );

exports.getAllQuestion = async (req, res, next) => {
  const { category } = req.query;

  if (!category) {
    const questions = await Question.find().populate();

    res.status(200).json({
      message: "successful",
      No_of_questions: questions.length,
      data: {
        questions,
      },
    });
  } else {
    console.log("category");

    try {
      const questions = await Question.find({
        questionCategory: category,
      }).populate();

      res.status(200).json({
        message: "successful",
        No_of_questions: questions.length,
        data: {
          questions,
        },
      });
    } catch (error) {
      return next(new HttpError("Something Went Wrong", 401));
    }
  }
};

exports.getQuestionByCategory = async (req, res, next) => {
  const { category } = req.query;

  if (!category) {
    const questions = await Question.find().populate();

    res.status(200).json({
      message: "successful",
      No_of_questions: questions.length,
      data: {
        questions,
      },
    });
  } else {
    try {
      const questions = await Question.find({ category: category }).populate();
      res.status(200).json({
        message: "successful",
        No_of_questions: questions.length,
        data: {
          questions,
        },
      });
    } catch (error) {
      return next(new HttpError("Something Went Wrong", 401));
    }
  }
};

exports.askAQuestion = async (req, res, next) => {
  console.log(req.body);
  const { questionTitle, questionBody, questionCategory, askedBy } = req.body;
  const userId = req.userData.id;

  // const newQuestion = await Question.create({
  //   questionTitle: questionTitle,
  //   questionBody: questionBody,
  //   questionCategory: questionCategory,
  //   askedBy: askedBy,
  //   _askerId: userId,
  // });
  const newQuestion = new Question({
    questionTitle: questionTitle,
    questionBody: questionBody,
    questionCategory: questionCategory,
    askedBy: askedBy,
    _askerId: userId,
  });

  let patient;
  try {
    patient = await Patient.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Failed to Ask Question , please try again",
      500
    );
    return next(error);
  }
  if (!patient) {
    const error = new HttpError("User Not Found", 404);
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newQuestion.save({ session: session });
    patient.questions.push(newQuestion);
    await patient.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err.message);
    const error = new HttpError(
      "Failed to Ask Question, please try again",
      500
    );
    return next(error);
  }

  res.status(201).json({
    message: "successful",
    data: {
      newQuestion,
    },
  });
};

// {
//   path: "questions",
//     select: "question _askerId",
//     }
exports.getQuestionsOfAnUser = async (req, res, next) => {
  let user;
  let id = req.params.id;

  try {
    if (req.userData.type === "patient") {
      user = await (await Patient.findById(id)).populate("questions");
    } else {
      user = await Doctor.findById(id).populate("questions");
    }
  } catch (error) {
    console.log(error.message);
  }

  res.status(200).json({
    message: "successful",
    data: {
      questions: user.questions.map((id) => id.toObject({ getters: true })),
    },
  });
};

exports.getAQuestion = async (req, res, next) => {
  const question = await Question.findById(req.params.id).populate({
    path: "answers",
    select: "answer answeredBy upvotes",
  });

  res.status(200).json({
    message: "successful",
    data: {
      question,
      id: req.userData.id,
    },
  });
};

exports.getAnAnswer = async (req, res, next) => {
  const answer = await Answer.findById(req.params.id);

  res.status(200).json({
    message: "successful",
    data: {
      answer,
    },
  });
};

exports.answerQuestion = async (req, res, next) => {
  if (req.userData.type === "Patient") {
    return next(new AppError("Unauthorized", 400));
  }
  const doctor = await Doctor.findById(req.userData.id);

  const newAnswer = await Answer.create({
    _questionId: req.params.id,
    answer: req.body.answer,
    answeredBy: doctor.id,
    upvotes: [],
  });

  res.status(201).json({
    message: "successful",
    data: {
      newAnswer,
    },
  });
};

exports.upvoteAnswer = async (req, res, next) => {
  const ansId = req.params.id;
  const id = req.userData.id;
  const answer = await Answer.findById(ansId);
  const isUpvoted = answer.upvotes && answer.upvotes.includes(id);

  let option;
  if (!isUpvoted) {
    option = "$addToSet";
  } else option = "$pull";
  let ans = await Answer.findByIdAndUpdate(
    ansId,
    {
      [option]: { upvotes: id },
    },
    { new: true }
  );

  res.status(201).json({
    message: "success",
    data: {
      ans,
    },
  });
};
