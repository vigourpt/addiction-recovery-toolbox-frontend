import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  useTheme,
  InputAdornment,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  ShoppingCart,
  LocalCafe,
  DirectionsCar,
  House,
  CardGiftcard,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { differenceInDays } from 'date-fns';

interface SavingsGoal {
  name: string;
  cost: number;
  icon: React.ReactNode;
  description: string;
}

const defaultGoals: SavingsGoal[] = [
  {
    name: 'Coffee Machine',
    cost: 200,
    icon: <LocalCafe />,
    description: 'Premium coffee maker for morning routines',
  },
  {
    name: 'Weekend Getaway',
    cost: 500,
    icon: <House />,
    description: 'Relaxing weekend trip to recharge',
  },
  {
    name: 'New Wardrobe',
    cost: 1000,
    icon: <ShoppingCart />,
    description: 'Refresh your style and confidence',
  },
  {
    name: 'Car Down Payment',
    cost: 5000,
    icon: <DirectionsCar />,
    description: 'Towards reliable transportation',
  },
];

const SavingsCalculator: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [dailySpend, setDailySpend] = useState<number>(20);
  const [customGoal, setCustomGoal] = useState<string>('');
  const [customCost, setCustomCost] = useState<number>(0);
  const [goals, setGoals] = useState<SavingsGoal[]>(defaultGoals);

  const sobrietyDays = user?.sobrietyDate
    ? differenceInDays(new Date(), new Date(user.sobrietyDate))
    : 0;

  const totalSaved = dailySpend * sobrietyDays;

  const handleAddCustomGoal = () => {
    if (customGoal && customCost > 0) {
      setGoals([
        ...goals,
        {
          name: customGoal,
          cost: customCost,
          icon: <CardGiftcard />,
          description: 'Custom savings goal',
        },
      ]);
      setCustomGoal('');
      setCustomCost(0);
    }
  };

  const getProgressToGoal = (cost: number) => {
    return Math.min((totalSaved / cost) * 100, 100);
  };

  const getDaysToGoal = (cost: number) => {
    const remaining = cost - totalSaved;
    if (remaining <= 0) return 0;
    return Math.ceil(remaining / dailySpend);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header Section */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.light} 90%)`,
          color: 'white',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Savings Calculator
        </Typography>
        <Typography variant="h2" sx={{ mb: 2 }}>
          ${totalSaved.toFixed(2)}
        </Typography>
        <Typography variant="body1">
          {sobrietyDays > 0
            ? `You've saved money for ${sobrietyDays} days!`
            : 'Start saving today!'}
        </Typography>
      </Paper>

      {/* Daily Spend Input */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Daily Spending
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            How much did you typically spend per day on your addiction?
          </Typography>
          <TextField
            fullWidth
            label="Daily Spend"
            type="number"
            value={dailySpend}
            onChange={(e) => setDailySpend(Number(e.target.value))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Savings Goals */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Savings Goals
      </Typography>
      <Grid container spacing={3}>
        {goals.map((goal, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      mr: 2,
                    }}
                  >
                    {goal.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6">{goal.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${goal.cost.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {goal.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: theme.palette.grey[200],
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${getProgressToGoal(goal.cost)}%`,
                        bgcolor: theme.palette.success.main,
                        transition: 'width 0.5s ease-in-out',
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mt: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {getProgressToGoal(goal.cost).toFixed(0)}% saved
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getDaysToGoal(goal.cost)} days to go
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Custom Goal */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add Custom Goal
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Goal Name"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Cost"
                type="number"
                value={customCost}
                onChange={(e) => setCustomCost(Number(e.target.value))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleAddCustomGoal}
                sx={{ height: '100%' }}
              >
                Add Goal
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Savings Tips */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Smart Saving Tips
      </Typography>
      <Card>
        <CardContent>
          <List>
            <ListItem>
              <ListItemIcon>
                <TrendingUp color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Set up automatic savings"
                secondary="Transfer your daily addiction spending to a separate savings account"
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemIcon>
                <AttachMoney color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Track every penny"
                secondary="Use a budgeting app to monitor your savings progress"
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemIcon>
                <CardGiftcard color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Reward yourself"
                secondary="Use some savings for healthy rewards when reaching milestones"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SavingsCalculator;
