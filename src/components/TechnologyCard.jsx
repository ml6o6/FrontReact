import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

function getStatusColor(status) {
  switch (status) {
    case "completed":
      return "success";
    case "in-progress":
      return "warning";
    default:
      return "default";
  }
}

function getStatusText(status) {
  switch (status) {
    case "completed":
      return "Выполнено";
    case "in-progress":
      return "В процессе";
    default:
      return "Не начато";
  }
}

export default function TechnologyCard({ technology, onOpen }) {
  const tech = technology || {};
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={onOpen}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onOpen) return;
        if (e.key === "Enter" || e.key === " ") onOpen();
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {tech.title}
        </Typography>

        {tech.description ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {tech.description}
          </Typography>
        ) : null}

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            label={tech.category || "other"}
            variant="outlined"
            size="small"
          />
          <Chip
            label={getStatusText(tech.status)}
            color={getStatusColor(tech.status)}
            size="small"
          />
          {tech.difficulty ? (
            <Chip label={tech.difficulty} size="small" />
          ) : null}
          {tech.deadline ? (
            <Chip label={`до ${tech.deadline}`} size="small" />
          ) : null}
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          size="small"
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            onOpen?.();
          }}
        >
          Открыть
        </Button>
      </CardActions>
    </Card>
  );
}
