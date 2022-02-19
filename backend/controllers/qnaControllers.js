const Question = require("../models/questionModel");
const Answer = require("../models/answerModel");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");

const sort = (questions, sortBy) => {
    let filteredQuestionsSorted;
    if (sortBy === `dateAsc`) {
        filteredQuestionsSorted = questions.sort((a, b) => {
            return Number(a.createdAt) - Number(b.createdAt)
        })
    } else if (sortBy === `dateDesc`) {
        filteredQuestionsSorted = questions.sort((a, b) => {
            return Number(b.createdAt) - Number(a.createdAt)
        })
    }else if (sortBy === `ansAsc`) {
        filteredQuestionsSorted = questions.sort((a, b) => {
            return Number(a._answersId.length) - Number(b._answersId.length)
        })
    } else if (sortBy === `ansDesc`) {
        filteredQuestionsSorted = questions.sort((a, b) => {
            return Number(b._answersId.length) - Number(a._answersId.length)
        })
    }
    return filteredQuestionsSorted;
};

exports.getAllQuestion = async (req, res, next) => {
    let { category, sortBy } = req.query;
    if (!sortBy) {
        sortBy = "dateDesc";
    }
    if (!category) {
        let questions = await Question.find().populate("_answersId");
        questions = sort(questions, sortBy);
        res.status(200).json({
            message: "successful",
            No_of_questions: questions.length,
            data: {
                questions,
            },
        });
    } else {
        try {
            let questions = await Question.find({
                questionCategory: category,
            }).populate("_answersId");
            questions = sort(questions, sortBy);
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
        const questions = await Question.find().populate("_answersId");

        res.status(200).json({
            message: "successful",
            No_of_questions: questions.length,
            data: {
                questions,
            },
        });
    } else {
        try {
            const questions = await Question.find({ category: category }).populate("_answersId");
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
exports.getQuestionsOfAnUser = async (req, res, next) => {
    let user;
    let id = req.params.id;

    try {
        user = await Patient.findById(id).populate("questions");
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
    const question = await Question.findById(req.params.id).populate("_answersId");

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
    const quesId = req.params.id;
    const newAnswer = new Answer({
        _questionId: req.params.id,
        answer: req.body.answer,
        answeredBy: doctor.id,
        doctorName: doctor.name,
        upvotes: [],
    });
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await newAnswer.save({ session: session });
        const question = await Question.findById(quesId);
        question._answersId.push(newAnswer);
        await question.save({ session: session });
        await session.commitTransaction();
    } catch (err) {
        console.log(err.message);
        const error = new HttpError("Failed to publish answer, please try again", 500);
        return next(error);
    }
    

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
    console.log(ansId);
    let answer;
    try {
        answer = await Answer.findById(ansId);

    } catch (err) {
        console.log(err.message);
    }
    const isUpvoted = answer.upvotes.length && answer.upvotes.includes(id);

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
