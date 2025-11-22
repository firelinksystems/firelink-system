import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Check as CompleteIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { jobsAPI } from '../services/api';
import { format } from 'date-fns';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const TechnicianPortal = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [todaysJobs, setTodaysJobs] = useState([]);
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    loadTechnicianJobs();
    
    if (socket) {
      socket.on('new_job_assignment', (newJob) => {
        setAssignedJobs(prev => [newJob, ...prev]);
      });
      
      socket.on('job_updated', (updatedJob) => {
        setTodaysJobs(prev => 
          prev.map(job => job.id === updatedJob.id ? updatedJob : job)
        );
        setAssignedJobs(prev => 
          prev.map(job => job.id === updatedJob.id ? updatedJob : job)
        );
      });
      
      return () => {
        socket.off('new_job_assignment');
        socket.off('job_updated');
      };
    }
  }, [socket]);

  const loadTechnicianJobs = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const todayResponse = await jobsAPI.getMyJobs(today);
      const assignedResponse = await jobsAPI.getAll({ 
        technician_id: user?.id,
        status: 'assigned'
      });
      
      setTodaysJobs(todayResponse.data || []);
      setAssignedJobs(assignedResponse.data?.data || []);
    } catch (error) {
      console.error('Failed to load technician jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (jobId, newStatus) => {
    try {
      await jobsAPI.updateStatus(jobId, { status: newStatus });
      loadTechnicianJobs(); // Reload to get updated data
    } catch (error) {
      console.error('Failed to update job status:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'primary',
      assigned: 'warning',
      in_progress: 'success',
      completed: 'default',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <Box p={3}>
      <Box mb={3}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Technician Portal
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your assigned jobs and daily schedule
        </Typography>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<ScheduleIcon />} 
            label={`Today's Jobs (${todaysJobs.length})`} 
          />
          <Tab 
            icon={<AssignmentIcon />} 
            label={`Assigned Jobs (${assignedJobs.length})`} 
          />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          {todaysJobs.length === 0 ? (
            <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
              No jobs scheduled for today
            </Typography>
          ) : (
            <List>
              {todaysJobs.map((job, index) => (
                <React.Fragment key={job.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography variant="h6" gutterBottom>
                              {job.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {job.site?.customer?.name} • {job.site?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {job.site?.address}
                            </Typography>
                            {job.scheduled_start_time && (
                              <Typography variant="body2" color="text.secondary">
                                Scheduled: {format(new Date(job.scheduled_start_time), 'hh:mm a')}
                              </Typography>
                            )}
                          </Box>
                          <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                            <Chip 
                              label={job.status} 
                              color={getStatusColor(job.status)}
                              size="small"
                            />
                            {job.status === 'assigned' && (
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<StartIcon />}
                                onClick={() => handleStatusUpdate(job.id, 'in_progress')}
                                sx={{
                                  backgroundColor: '#2e7d32',
                                  '&:hover': { backgroundColor: '#1b5e20' }
                                }}
                              >
                                Start Job
                              </Button>
                            )}
                            {job.status === 'in_progress' && (
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<CompleteIcon />}
                                onClick={() => handleStatusUpdate(job.id, 'completed')}
                                sx={{
                                  backgroundColor: '#d32f2f',
                                  '&:hover': { backgroundColor: '#b71c1c' }
                                }}
                              >
                                Complete
                              </Button>
                            )}
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {job.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < todaysJobs.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {assignedJobs.length === 0 ? (
            <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
              No assigned jobs
            </Typography>
          ) : (
            <List>
              {assignedJobs.map((job, index) => (
                <React.Fragment key={job.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography variant="h6" gutterBottom>
                              {job.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {job.site?.customer?.name} • {job.site?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Scheduled: {job.scheduled_date ? format(new Date(job.scheduled_date), 'MMM dd, yyyy') : 'Not scheduled'}
                            </Typography>
                          </Box>
                          <Chip 
                            label={job.status} 
                            color={getStatusColor(job.status)}
                            size="small"
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < assignedJobs.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </TabPanel>
      </Paper>

      {/* Quick Stats */}
      <Box mt={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Today's Jobs
                </Typography>
                <Typography variant="h4">
                  {todaysJobs.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  In Progress
                </Typography>
                <Typography variant="h4">
                  {todaysJobs.filter(job => job.status === 'in_progress').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Completed Today
                </Typography>
                <Typography variant="h4">
                  {todaysJobs.filter(job => job.status === 'completed').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Assigned
                </Typography>
                <Typography variant="h4">
                  {assignedJobs.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TechnicianPortal;
