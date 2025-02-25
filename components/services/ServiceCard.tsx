import { FC, useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  Grid,
  IconButton,
  IconButtonProps,
  Tooltip,
  Typography,
  TooltipProps,
  tooltipClasses,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}
import { styled } from "@mui/material/styles";

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
import { IServiceSchema } from "@/interfaces";

interface Props {
  service: IServiceSchema;
}

const GreenTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#008f39",
    color: "#ffff",
    // boxShadow: theme.shadows[1],
    fontSize: 16,
  },
}));

export const ServiceCard: FC<Props> = ({ service }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Grid
      item
      xs={12}
      sm={6}
      display="flex"
      justifyContent="space-evenly"
      alignItems="center"
    >
      <Card
        sx={{
          width: "80%",
          // minHeight: "600px",
          boxShadow: "0px 0px 0px 0px",
        }}
        id={`${service.title}`}
      >
        <CardContent>
          <Typography
            variant="h2"
            component="div"
            sx={{ textAlign: "center", fontSize: "30px" }}
          >
            {service.title}
          </Typography>
        </CardContent>
        <CardMedia
          component="img"
          height="300"
          image={service.images[0]}
          alt={service.title}
          onClick={handleExpandClick}
        />
        <CardActions disableSpacing>
          {!expanded && (
            <Typography>{service.description.slice(0, 45)}...</Typography>
          )}

          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <GreenTooltip title="Leer más" placement="right" arrow>
              <ExpandMoreIcon sx={{ fontSize: "40px" }} />
            </GreenTooltip>
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph textAlign="justify">{service.description}</Typography>
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  );
};
