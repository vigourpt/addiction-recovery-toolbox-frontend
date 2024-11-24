import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import {
  Timeline,
  CalendarToday,
  AttachMoney,
  Favorite,
  EmojiEvents,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { differenceInDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// Quick Action Card Component
const QuickActionCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, description, icon, onClick }) => (
  <Box
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-4px)',
        transition: 'transform 0.2s ease-in-out',
      },
    }}
    onClick={onClick}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {icon}
      <Typography variant="h6" sx={{ ml: 1 }}>
        {title}
      </Typography>
    </Box>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Box>
);

// Progress Card Component
const ProgressCard: React.FC<{
  title: string;
  value: number;
  total: number;
  unit: string;
}> = ({ title, value, total, unit }) => {
  const progress = (value / total) * 100;
  
  return (
    <Box sx={{ height: '100%' }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" component="div">
            {value}
            <Typography variant="body2" component="span" sx={{ ml: 1 }}>
              {unit}
            </Typography>
          </Typography>
        </Box>
        <Box sx={{ height: 8, borderRadius: 4, backgroundColor: 'grey' }}>
          <Box sx={{ height: 8, borderRadius: 4, backgroundColor: 'primary.main', width: `${progress}%` }} />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {progress.toFixed(0)}% of {total} {unit} goal
        </Typography>
      </Box>
    </Box>
  );
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  // If user is not loaded yet, show loading state
  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  // Calculate sobriety days (if sobrietyDate is set)
  const sobrietyDays = user?.sobrietyDate
    ? differenceInDays(new Date(), new Date(user.sobrietyDate))
    : 0;

  // Mock data for demonstration
  const mockData = {
    moneySaved: 450,
    monthlyGoal: 600,
    streakDays: sobrietyDays,
    yearlyGoal: 365,
    healthScore: 75,
    maxHealth: 100,
  };

  const quickActions = [
    {
      title: 'Track Progress',
      description: 'Log your daily progress and view insights',
      icon: <Timeline sx={{ color: theme.palette.primary.main }} />,
      onClick: () => navigate('/progress'),
    },
    {
      title: 'Update Sobriety',
      description: 'Mark your achievements and milestones',
      icon: <CalendarToday sx={{ color: theme.palette.secondary.main }} />,
      onClick: () => navigate('/sobriety'),
    },
    {
      title: 'Calculate Savings',
      description: 'Track your financial improvements',
      icon: <AttachMoney sx={{ color: theme.palette.success.main }} />,
      onClick: () => navigate('/savings'),
    },
    {
      title: 'Check Health',
      description: 'Monitor your health improvements',
      icon: <Favorite sx={{ color: theme.palette.error.main }} />,
      onClick: () => navigate('/health'),
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Welcome Section */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
          color: 'white',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1">
          {sobrietyDays > 0
            ? `You've been sober for ${sobrietyDays} days. Keep going!`
            : 'Start your journey today!'}
        </Typography>
      </Paper>

      {/* Progress Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <ProgressCard
            title="Sobriety Streak"
            value={mockData.streakDays}
            total={mockData.yearlyGoal}
            unit="days"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ProgressCard
            title="Money Saved"
            value={mockData.moneySaved}
            total={mockData.monthlyGoal}
            unit="$"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ProgressCard
            title="Health Score"
            value={mockData.healthScore}
            total={mockData.maxHealth}
            unit="points"
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3}>
        {quickActions.map((action) => (
          <Grid item xs={12} sm={6} md={3} key={action.title}>
            <QuickActionCard {...action} />
          </Grid>
        ))}
      </Grid>

      {/* Achievements Section */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Recent Achievements
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmojiEvents
                sx={{ fontSize: 40, color: theme.palette.warning.main, mr: 2 }}
              />
              <Box>
                <Typography variant="h6">
                  {sobrietyDays >= 7
                    ? '1 Week Milestone Achieved!'
                    : 'Next Milestone: 1 Week'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Keep going! Every day counts towards your recovery.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
