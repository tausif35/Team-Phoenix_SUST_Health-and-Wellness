import { Stack } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleQuestion } from "../actions/queAnsActions";
import BlogCommentField from "../components/blog/BlogCommentField";
import BlogCommentList from "../components/blog/BlogCommentList";
import SingleBlog from "../components/blog/SingleBlog";
import AnswerField from "../components/que_ans/AnswerField";
import AnswerList from "../components/que_ans/AnswerList";
import SingleQuestion from "../components/que_ans/SingleQuestion";

function SingleBlogPage() {
  const params = useParams();
  const dispatch = useDispatch();

  const { loading, error, blog } = useSelector((state) => state.singleBlog);

  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    dispatch(getSingleQuestion(params.blogId));
  }, [dispatch, params.blogId]);

  return blog && Object.keys(blog).length ? (
    <Stack spacing={4} alignItems="center" p={4}>
      <SingleBlog item={blog} />
      {userInfo.role === "user" && <BlogCommentField blogId={params.blogId} />}
      <BlogCommentList comments={blog.comments} />
    </Stack>
  ) : (
    <></>
  );
}

export default SingleBlogPage;
