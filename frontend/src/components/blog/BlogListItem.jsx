import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { API_HOST } from "../../constants/apiLinks";

function BlogListItem({ item }) {
  const navigate = useNavigate();

  const onItemClick = () => {
    navigate(`/blogs/${item.id}`);
  };

  return (
    <Card onClick={onItemClick}>
      <CardActionArea>
        <CardMedia
          component="img"
          height={150}
          image={`${API_HOST}/${item.photo}`}
          alt={item.name}
        />

        <CardContent>
          <Typography variant="h6" mb={2}>
            {item.blogTitle}
          </Typography>

          <Typography variant="body1" mb={2}>
            by {item.authorName}
          </Typography>

          <Typography variant="body1" mb={2}>
            {item.upvotes.length} upvotes
          </Typography>

          <Chip label={item.blogCategory} color="primary" variant="outlined" />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default BlogListItem;
