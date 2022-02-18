import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputBase,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { questionCategories } from "../../utils/categoryList";

function QuestionField() {
  const [showDialog, setShowDialog] = useState(false);
  const [valueMissing, setValueMissing] = useState(false);
  const [queCategories, setQueCategories] = useState([]);
  const [question, setQuestion] = useState("");

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  const handlePost = () => {
    console.log(question);
    console.log(queCategories);
    setShowDialog(false);
  };

  return (
    <Paper sx={{ width: "100%", maxWidth: "800px", alignSelf: "center" }}>
      <Stack p={3} spacing={2}>
        <Typography variant="h5">Ask Questions</Typography>

        <Button
          variant="outlined"
          size="large"
          onClick={() => setShowDialog(true)}
        >
          What's on your mind?
        </Button>

        <Dialog fullWidth open={showDialog} onClose={handleDialogClose}>
          <DialogTitle>Ask Your Question</DialogTitle>

          <DialogContent>
            <Stack spacing={4}>
              <TextField
                multiline
                rows={4}
                variant="filled"
                placeholder="Write your question here"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />

              <Autocomplete
                multiple
                fullWidth
                value={queCategories}
                options={questionCategories}
                getOptionLabel={(option) => option}
                onChange={(e, values) => setQueCategories(values)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Categories"
                    error={valueMissing && !queCategories.length}
                    helperText={
                      valueMissing && !queCategories.length
                        ? "Please set your question categories"
                        : ""
                    }
                    sx={{ borderRadius: "100px" }}
                  />
                )}
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleDialogClose}>Close</Button>
            <Button onClick={handlePost}>Post</Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Paper>
  );
}

export default QuestionField;
