import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Rating,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Favorite,
  SentimentVeryDissatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
  SentimentSatisfied,
  SentimentVerySatisfied,
  LocalHospital,
  FitnessCenter,
  Restaurant,
  Spa,
  NightsStay,
  Edit,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { differenceInDays, format } from 'date-fns';

interface HealthMetric {
  name: string;
  icon: React.ReactNode;
  value: number;
  description: string;
}

interface SymptomLog {
  date: Date;
  mood: number;
  energy: number;
  sleep: number;
  appetite: number;
  cravings: number;
  notes: string;
}

const customIcons: { [index: number]: React.ReactElement } = {
  1: <SentimentVeryDissatisfied color="error" />,
  2: <SentimentDissatisfied color="warning" />,
  3: <SentimentNeutral color="info" />,
  4: <SentimentSatisfied color="success" />,
  5: <SentimentVerySatisfied color="success" />,
};

const HealthProgress: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentLog, setCurrentLog] = useState<SymptomLog>({
    date: new Date(),
    mood: 3,
    energy: 3,
    sleep: 3,
    appetite: 3,
    cravings: 3,
    notes: '',
  });
  const [logs, setLogs] = useState<SymptomLog[]>([]);

  const sobrietyDays = user?.sobrietyDate
    ? differenceInDays(new Date(), new Date(user.sobrietyDate))
    : 0;

  const healthMetrics: HealthMetric[] = [
    {
      name: 'Physical Health',
      icon: <FitnessCenter color="primary" />,
      value: calculateMetricProgress(sobrietyDays, 90),
      description: 'Improved strength and energy levels',
    },
    {
      name: 'Mental Clarity',
      icon: <Spa color="secondary" />,
      value: calculateMetricProgress(sobrietyDays, 60),
      description: 'Enhanced focus and decision-making',
    },
    {
      name: 'Sleep Quality',
      icon: <NightsStay color="primary" />,
      value: calculateMetricProgress(sobrietyDays, 30),
      description: 'Better sleep patterns and rest',
    },
    {
      name: 'Nutrition',
      icon: <Restaurant color="secondary" />,
      value: calculateMetricProgress(sobrietyDays, 45),
      description: 'Improved appetite and eating habits',
    },
  ];

  function calculateMetricProgress(days: number, maxDays: number): number {
    return Math.min((days / maxDays) * 100, 100);
  }

  const handleSaveLog = () => {
    setLogs([currentLog, ...logs]);
    setOpenDialog(false);
  };

  const getAverageRating = (metric: keyof SymptomLog): number => {
    if (logs.length === 0) return 0;
    const sum = logs.reduce((acc, log) => acc + (log[metric] as number), 0);
    return sum / logs.length;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header Section */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
          color: 'white',
          position: 'relative',
        }}
      >
        <IconButton
          sx={{ position: 'absolute', top: 8, right: 8, color: 'white' }}
          onClick={() => setOpenDialog(true)}
        >
          <Edit />
        </IconButton>
        <Typography variant="h4" gutterBottom>
          Health Progress
        </Typography>
        <Typography variant="h6">
          {sobrietyDays} Days of Healing
        </Typography>
      </Paper>

      {/* Health Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {healthMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {metric.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {metric.name}
                  </Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={metric.value}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {metric.description}
                </Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ mt: 1, fontWeight: 'bold' }}
                >
                  {metric.value.toFixed(0)}% Progress
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recovery Timeline */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recovery Timeline
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <LocalHospital color="error" />
              </ListItemIcon>
              <ListItemText
                primary="24-72 Hours"
                secondary="Physical withdrawal symptoms peak and begin to subside"
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemIcon>
                <Favorite color="error" />
              </ListItemIcon>
              <ListItemText
                primary="1 Week"
                secondary="Sleep patterns begin to normalize, energy levels improve"
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemIcon>
                <FitnessCenter color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="2-4 Weeks"
                secondary="Physical health shows marked improvement"
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemIcon>
                <Spa color="success" />
              </ListItemIcon>
              <ListItemText
                primary="1-3 Months"
                secondary="Mental clarity and emotional stability enhance significantly"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Symptom Tracking */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Symptoms Log
              </Typography>
              {logs.length > 0 ? (
                logs.slice(0, 5).map((log, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">
                      {format(log.date, 'MMM dd, yyyy')}
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Mood: {customIcons[log.mood]}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Energy: {customIcons[log.energy]}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          Notes: {log.notes}
                        </Typography>
                      </Grid>
                    </Grid>
                    {index < 4 && <Divider sx={{ my: 1 }} />}
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary">
                  No symptom logs yet. Click the edit button to add one.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Progress
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Average Mood" />
                  <Rating
                    value={getAverageRating('mood')}
                    readOnly
                    precision={0.5}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Energy Levels" />
                  <Rating
                    value={getAverageRating('energy')}
                    readOnly
                    precision={0.5}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Sleep Quality" />
                  <Rating
                    value={getAverageRating('sleep')}
                    readOnly
                    precision={0.5}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Appetite" />
                  <Rating
                    value={getAverageRating('appetite')}
                    readOnly
                    precision={0.5}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Cravings Control" />
                  <Rating
                    value={getAverageRating('cravings')}
                    readOnly
                    precision={0.5}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Symptom Log Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Log Daily Symptoms</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography gutterBottom>Mood</Typography>
              <Rating
                value={currentLog.mood}
                onChange={(_, value) =>
                  setCurrentLog({ ...currentLog, mood: value || 3 })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Energy Level</Typography>
              <Rating
                value={currentLog.energy}
                onChange={(_, value) =>
                  setCurrentLog({ ...currentLog, energy: value || 3 })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Sleep Quality</Typography>
              <Rating
                value={currentLog.sleep}
                onChange={(_, value) =>
                  setCurrentLog({ ...currentLog, sleep: value || 3 })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Appetite</Typography>
              <Rating
                value={currentLog.appetite}
                onChange={(_, value) =>
                  setCurrentLog({ ...currentLog, appetite: value || 3 })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Cravings Intensity</Typography>
              <Rating
                value={currentLog.cravings}
                onChange={(_, value) =>
                  setCurrentLog({ ...currentLog, cravings: value || 3 })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={currentLog.notes}
                onChange={(e) =>
                  setCurrentLog({ ...currentLog, notes: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveLog} variant="contained">
            Save Log
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HealthProgress;
