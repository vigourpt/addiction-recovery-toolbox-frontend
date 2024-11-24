import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  useTheme,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle,
  Assignment,
  Add,
  Delete,
  Edit,
  LocalHospital,
  Group,
  Psychology,
  Home,
  CalendarMonth,
  Note,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  dueDate?: string;
  notes?: string;
  userId?: string;
}

const categories = [
  { name: 'All', icon: <Assignment /> },
  { name: 'Medical', icon: <LocalHospital /> },
  { name: 'Planning', icon: <CalendarMonth /> },
  { name: 'Support', icon: <Group /> },
  { name: 'Treatment', icon: <Psychology /> },
  { name: 'Lifestyle', icon: <Home /> },
];

const RehabChecklist: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState<ChecklistItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState<Partial<ChecklistItem>>({
    title: '',
    description: '',
    category: 'Medical',
    completed: false,
  });

  // Fetch checklist items from the backend
  useEffect(() => {
    const fetchItems = async () => {
      if (user?.email) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/checklist`, {
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setItems(data.items);
          }
        } catch (error) {
          console.error('Error fetching checklist items:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchItems();
  }, [user]);

  const handleToggle = async (id: string) => {
    try {
      const itemToUpdate = items.find(item => item.id === id);
      if (!itemToUpdate || !user) return;

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/checklist/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          completed: !itemToUpdate.completed
        })
      });

      if (response.ok) {
        setItems(items.map(item =>
          item.id === id ? { ...item, completed: !item.completed } : item
        ));
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleAddItem = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/checklist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify(newItem)
      });

      if (response.ok) {
        const data = await response.json();
        setItems([...items, data.item]);
        setOpenDialog(false);
        setNewItem({
          title: '',
          description: '',
          category: 'Medical',
          completed: false,
        });
      }
    } catch (error) {
      console.error('Error adding checklist item:', error);
    }
  };

  const handleUpdateItem = async () => {
    if (!editItem || !user) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/checklist/${editItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify(editItem)
      });

      if (response.ok) {
        const data = await response.json();
        setItems(items.map(item => item.id === editItem.id ? data.item : item));
        setEditItem(null);
      }
    } catch (error) {
      console.error('Error updating checklist item:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!user) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/checklist/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`
        }
      });

      if (response.ok) {
        setItems(items.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting checklist item:', error);
    }
  };

  const filteredItems = items.filter(
    item => selectedCategory === 'All' || item.category === selectedCategory
  );

  const progress = {
    total: items.length,
    completed: items.filter(item => item.completed).length,
    percentage: items.length > 0
      ? Math.round((items.filter(item => item.completed).length / items.length) * 100)
      : 0
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header Section */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.light} 90%)`,
          color: 'white',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Rehab Checklist
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6">
            {progress.completed} of {progress.total} tasks completed
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            sx={{ bgcolor: 'white', color: 'secondary.main' }}
          >
            Add Task
          </Button>
        </Box>
      </Paper>

      {/* Category Filter */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {categories.map((category) => (
          <Chip
            key={category.name}
            icon={category.icon}
            label={category.name}
            onClick={() => setSelectedCategory(category.name)}
            color={selectedCategory === category.name ? 'primary' : 'default'}
            variant={selectedCategory === category.name ? 'filled' : 'outlined'}
          />
        ))}
      </Box>

      {/* Checklist Items */}
      <Card>
        <List>
          {filteredItems.length === 0 ? (
            <ListItem>
              <ListItemText 
                primary="No tasks found"
                secondary={selectedCategory === 'All' 
                  ? "Click 'Add Task' to create your first task"
                  : "No tasks in this category"}
              />
            </ListItem>
          ) : (
            filteredItems.map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && <Divider />}
                <ListItem
                  disablePadding
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        onClick={() => setEditItem(item)}
                        sx={{ mr: 1 }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemButton onClick={() => handleToggle(item.id)} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={item.completed}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          sx={{
                            textDecoration: item.completed
                              ? 'line-through'
                              : 'none',
                          }}
                        >
                          {item.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {item.description}
                          </Typography>
                          {item.dueDate && (
                            <Typography
                              variant="caption"
                              color="primary"
                              sx={{ display: 'block', mt: 0.5 }}
                            >
                              Due: {item.dueDate}
                            </Typography>
                          )}
                          {item.notes && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'block', mt: 0.5 }}
                            >
                              Notes: {item.notes}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </React.Fragment>
            ))
          )}
        </List>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog || !!editItem}
        onClose={() => {
          setOpenDialog(false);
          setEditItem(null);
        }}
      >
        <DialogTitle>
          {editItem ? 'Edit Task' : 'Add New Task'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={editItem ? editItem.title : newItem.title}
                onChange={(e) =>
                  editItem
                    ? setEditItem({ ...editItem, title: e.target.value })
                    : setNewItem({ ...newItem, title: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={editItem ? editItem.description : newItem.description}
                onChange={(e) =>
                  editItem
                    ? setEditItem({ ...editItem, description: e.target.value })
                    : setNewItem({ ...newItem, description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Category"
                value={editItem ? editItem.category : newItem.category}
                onChange={(e) =>
                  editItem
                    ? setEditItem({ ...editItem, category: e.target.value })
                    : setNewItem({ ...newItem, category: e.target.value })
                }
                SelectProps={{
                  native: true,
                }}
              >
                {categories
                  .filter((cat) => cat.name !== 'All')
                  .map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={editItem ? editItem.dueDate : newItem.dueDate}
                onChange={(e) =>
                  editItem
                    ? setEditItem({ ...editItem, dueDate: e.target.value })
                    : setNewItem({ ...newItem, dueDate: e.target.value })
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={editItem ? editItem.notes : newItem.notes}
                onChange={(e) =>
                  editItem
                    ? setEditItem({ ...editItem, notes: e.target.value })
                    : setNewItem({ ...newItem, notes: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setEditItem(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={editItem ? handleUpdateItem : handleAddItem}
            variant="contained"
            color="primary"
          >
            {editItem ? 'Save Changes' : 'Add Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RehabChecklist;
