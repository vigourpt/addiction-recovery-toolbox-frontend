import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  Link,
} from '@mui/material';
import {
  LocalHospital,
  Group,
  Book,
  Phone,
  Web,
  Psychology,
  School,
  EmojiObjects,
} from '@mui/icons-material';

interface ResourceItem {
  title: string;
  description: string;
  contact?: string | undefined;
  link: string;
}

interface ResourceCategory {
  category: string;
  icon: JSX.Element;
  items: ResourceItem[];
}

const resources: ResourceCategory[] = [
  {
    category: 'Emergency Help',
    icon: <Phone color="error" />,
    items: [
      {
        title: 'SAMHSA National Helpline',
        description: '24/7 treatment referral and information',
        contact: '1-800-662-4357',
        link: 'https://www.samhsa.gov/find-help/national-helpline',
      },
      {
        title: 'National Suicide Prevention Lifeline',
        description: '24/7 crisis support',
        contact: '988',
        link: 'https://988lifeline.org/',
      },
    ],
  },
  {
    category: 'Support Groups',
    icon: <Group color="primary" />,
    items: [
      {
        title: 'Alcoholics Anonymous',
        description: 'Find local AA meetings',
        link: 'https://www.aa.org/find-aa',
      },
      {
        title: 'Narcotics Anonymous',
        description: 'Find local NA meetings',
        link: 'https://www.na.org/meetingsearch/',
      },
      {
        title: 'SMART Recovery',
        description: 'Self-Management and Recovery Training',
        link: 'https://www.smartrecovery.org/',
      },
    ],
  },
  {
    category: 'Treatment Centers',
    icon: <LocalHospital color="secondary" />,
    items: [
      {
        title: 'SAMHSA Treatment Locator',
        description: 'Find treatment facilities near you',
        link: 'https://findtreatment.gov/',
      },
      {
        title: 'American Society of Addiction Medicine',
        description: 'Find an addiction specialist',
        link: 'https://www.asam.org/find-treatment',
      },
    ],
  },
  {
    category: 'Educational Resources',
    icon: <School />,
    items: [
      {
        title: 'National Institute on Drug Abuse',
        description: 'Science-based information about addiction',
        link: 'https://nida.nih.gov/',
      },
      {
        title: 'MedlinePlus Addiction',
        description: 'Trusted health information',
        link: 'https://medlineplus.gov/addiction.html',
      },
    ],
  },
  {
    category: 'Mental Health',
    icon: <Psychology color="info" />,
    items: [
      {
        title: 'Psychology Today',
        description: 'Find a therapist',
        link: 'https://www.psychologytoday.com/us/therapists',
      },
      {
        title: 'Mental Health America',
        description: 'Mental health resources and screening tools',
        link: 'https://www.mhanational.org/',
      },
    ],
  },
  {
    category: 'Self-Help Tools',
    icon: <EmojiObjects color="warning" />,
    items: [
      {
        title: 'Recovery Apps',
        description: 'Mobile apps for recovery support',
        link: 'https://www.addictioncenter.com/apps-tools/',
      },
      {
        title: 'Mindfulness Resources',
        description: 'Meditation and mindfulness techniques',
        link: 'https://www.mindful.org/meditation/mindfulness-getting-started/',
      },
    ],
  },
];

const Resources: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header Section */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
          color: 'white',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Recovery Resources
        </Typography>
        <Typography variant="body1">
          Access helpful resources and support for your recovery journey
        </Typography>
      </Paper>

      {/* Resources Grid */}
      <Grid container spacing={3}>
        {resources.map((category) => (
          <Grid item xs={12} md={6} key={category.category}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 2 }}>{category.icon}</Box>
                  <Typography variant="h6">{category.category}</Typography>
                </Box>
                <List>
                  {category.items.map((item, index) => (
                    <React.Fragment key={item.title}>
                      {index > 0 && <Divider />}
                      <ListItem>
                        <ListItemText
                          primary={
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              color="primary"
                              underline="hover"
                            >
                              {item.title}
                            </Link>
                          }
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                              >
                                {item.description}
                              </Typography>
                              {item.contact && (
                                <Typography
                                  component="div"
                                  variant="body2"
                                  color="primary"
                                  sx={{ mt: 0.5 }}
                                >
                                  Contact: {item.contact}
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Resources;
