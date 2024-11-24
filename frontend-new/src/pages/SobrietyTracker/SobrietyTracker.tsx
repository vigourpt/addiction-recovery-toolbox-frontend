import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  useTheme,
  LinearProgress,
} from '@mui/material';
import {
  CalendarToday,
  EmojiEvents,
  Edit,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
  addDays,
} from 'date-fns';
import { useAuth } from '../../context/AuthContext';

const milestones = [
  { days: 1, title: '24 Hours', description: 'The first day is complete!' },
  { days: 7, title: '1 Week', description: 'A full week of strength!' },
  { days: 30, title: '1 Month', description: 'One month milestone achieved!' },
  { days: 90, title: '3 Months', description: 'Quarter year of success!' },
  { days: 180, title: '6 Months', description: 'Half year accomplished!' },
  { days: 365, title: '1 Year', description: 'One year of transformation!' },
];

const healthBenefits = [
  {
    time: '20 minutes',
    benefit: 'Heart rate and blood pressure begin to drop',
    icon: <CheckCircle color="success" />,
  },
  {
    time: '12 hours',
    benefit: 'Carbon monoxide levels in blood return to normal',
    icon: <CheckCircle color="success" />,
  },
  {
    time: '24 hours',
    benefit: 'Anxiety and irritability begin to fade',
    icon: <CheckCircle color="success" />,
  },
  {
    time: '48 hours',
    benefit: 'Sense of smell and taste improve',
    icon: <CheckCircle color="success" />,
  },
  {
    time: '72 hours',
    benefit: 'Energy levels increase',
    icon: <CheckCircle color="success" />,
  },
  {
    time: '1 week',
    benefit: 'Quality of sleep improves',
    icon: <Warning color="warning" />,
  },
  {
    time: '2 weeks',
    benefit: 'Circulation improves',
    icon: <Warning color="warning" />,
  },
  {
    time: '1 month',
    benefit: 'Mental clarity and focus enhance',
    icon: <Warning color="warning" />,
  },
];

interface UserData {
  sobrietyDate: string | null;
  addictionType: string | null;
}

const SobrietyTracker: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.email) {
        try {
          const idToken = await user.getIdToken();
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/me`, {
            headers: {
              Authorization: `Bearer ${idToken}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUserData(data.user);
            if (data.user.sobrietyDate) {
              setSelectedDate(new Date(data.user.sobrietyDate));
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const sobrietyDays = userData?.sobrietyDate
    ? differenceInDays(new Date(), new Date(userData.sobrietyDate))
    : 0;

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleSaveDate = async () => {
    if (selectedDate && user) {
      try {
        const idToken = await user.getIdToken();
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/me`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`
          },
          body: JSON.stringify({
            sobrietyDate: selectedDate.toISOString()
          })
        });

        if (response.ok) {
          setUserData(prev => prev ? { ...prev, sobrietyDate: selectedDate.toISOString() } : null);
          setOpenDialog(false);
        }
      } catch (error) {
        console.error('Error updating sobriety date:', error);
      }
    }
  };

  const getNextMilestone = () => {
    const nextMilestone = milestones.find((m) => m.days > sobrietyDays);
    if (!nextMilestone) return milestones[milestones.length - 1];
    return nextMilestone;
  };

  const getProgress = () => {
    const next = getNextMilestone();
    const prev = milestones[milestones.indexOf(next) - 1];
    const progress = ((sobrietyDays - (prev?.days || 0)) /
      (next.days - (prev?.days || 0))) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            Your Sobriety Journey
          </Typography>
          <Typography variant="h2" sx={{ mb: 2 }}>
            {sobrietyDays} Days
          </Typography>
          <Typography variant="body1">
            Started on:{' '}
            {userData?.sobrietyDate
              ? format(new Date(userData.sobrietyDate), 'MMMM do, yyyy')
              : 'Not set'}
          </Typography>
        </Paper>

        {/* Progress Section */}
        <Grid container spacing={3}>
          {/* Next Milestone Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmojiEvents
                    sx={{ fontSize: 40, color: theme.palette.warning.main, mr: 2 }}
                  />
                  <Typography variant="h6">Next Milestone</Typography>
                </Box>
                <Typography variant="h5" gutterBottom>
                  {getNextMilestone().title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {getNextMilestone().description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={getProgress()}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {getProgress().toFixed(0)}% to next milestone
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Health Benefits Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Health Benefits Timeline
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {healthBenefits.map((benefit, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      {benefit.icon}
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle2">{benefit.time}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {benefit.benefit}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Date Selection Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Set Your Sobriety Start Date</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <DatePicker
                label="Sobriety Start Date"
                value={selectedDate}
                onChange={handleDateChange}
                maxDate={new Date()}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveDate} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default SobrietyTracker;
