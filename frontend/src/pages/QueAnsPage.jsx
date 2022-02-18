import { Grid, Stack } from "@mui/material";
import React from "react";
import PersonalQuestion from "../components/que_ans/PersonalQuestions";
import QuestionField from "../components/que_ans/QuestionField";
import QuestionFilter from "../components/que_ans/QuestionFilter";

function QueAnsPage() {
  return (
    <Grid container spacing={4} p={4} columns={{ xs: 1, sm: 5, md: 9 }}>
      <Grid item xs={1} md={2}>
        <PersonalQuestion />
      </Grid>
      <Grid item xs={1} sm={3} md={5} display="flex" justifyContent={"center"}>
        <QuestionField />
      </Grid>
      <Grid item xs={1} md={2}>
        <QuestionFilter />
      </Grid>
    </Grid>
  );
}

export default QueAnsPage;
