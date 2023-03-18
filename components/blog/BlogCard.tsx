import { FC, useState } from "react";
import { IBlogSchema } from "@/interfaces";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  Grid,
  IconButton,
  IconButtonProps,
  Typography,
} from "@mui/material";

import {
  Share as ShareIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

import { styled } from "@mui/material/styles";
import { green } from "@mui/material/colors";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface Props {
  blog: IBlogSchema;
}

export const BlogCard: FC<Props> = ({ blog }) => {
  const [expanded, setExpanded] = useState(false);

  //@ts-ignore
  const date = new Date(blog?.createdAt);

  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); 
  const year = date.getUTCFullYear().toString().slice(-2);

  const actualDate = `${day}-${month}-${year}`;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Grid item>
      <Card sx={{ maxWidth: 345 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: green[500] }} aria-label="recipe">
              T
            </Avatar>
          }
          title={blog.title}
          subheader={actualDate}
        />
        <CardMedia
          component="img"
          height="194"
          image={blog.images[0]}
          alt="Paella dish"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {blog.description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>{blog.info}</Typography>
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  );
};
