import { Grid, Stack } from "@mui/material";
import React from "react";
import PersonalQuestion from "../components/que_ans/PersonalQuestions";
import QuestionField from "../components/que_ans/QuestionField";
import QuestionFilter from "../components/que_ans/QuestionFilter";
import QuestionList from "../components/que_ans/QuestionList";

function QueAnsPage() {
  const questions = [
    {
      _id: "1",
      questionTitle: "sasdasdasd",
      questionBody:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, eius!",
      questionCategory: "scxxcxc",
      askedBy: "sdsds",
      _answersId: ["23", "34"],
    },
    {
      _id: "2",
      questionTitle: "sasdasdasd",
      questionBody:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Distinctio beatae voluptatum illo, praesentium officia aliquid qui assumenda hic libero atque!",
      questionCategory: "scxxcxc",
      askedBy: "sdsds",
      _answersId: ["23", "34"],
    },
  ];

  return (
    <Grid container spacing={4} p={4} columns={{ xs: 1, md: 9 }}>
      <Grid item xs={1} md={2}>
        <QuestionFilter />
      </Grid>
      <Grid item xs={1} md={5} display="flex">
        <Stack spacing={4} width={"100%"} alignItems={"center"}>
          <QuestionField />
          {questions.map((item, index) => (
            <QuestionList key={index} item={item} />
          ))}
        </Stack>
      </Grid>
      <Grid item xs={1} md={2}>
        <PersonalQuestion />
      </Grid>
    </Grid>
  );
}

export default QueAnsPage;
