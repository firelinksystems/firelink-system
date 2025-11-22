import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  TablePagination,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  PlayArrow as StartIcon,
  Check as CompleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { jobsAPI } from '../services/api';
import { format } from 'date-fns';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    status: '',
    technician_id: '',
  });
  const { isAdmin, isManager } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    loadJobs();
    
    if (socket) {
      socket.on('job_updated', (updatedJob) => {
        setJobs(prevJobs => 
          prevJobs.map(job => 
            job.id === updatedJob.id ? updatedJob : job
          )
        );
      });
      
      return () => {
        socket.off('job_updated');
      };
    }
  }, [socket]);

  const loadJobs = async () => {
    try {
      const response = await jobsAPI.getAll({
        page: page + 1,
        limit: rowsPerPage,
        ...filters
      });
      setJobs(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    // Reload jobs when filters change
    setTimeout(() => {
      loadJobs();
    }, 300);
  };

  const handleStatusUpdate = async (jobId, newStatus) => {
    try {
      await jobsAPI.updateStatus(jobId, { status: newStatus });
      loadJobs(); // Reload to get updated data
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

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'default',
      medium: 'primary',
      high: 'warning',
      emergency: 'error',
    };
    return colors[priority] || 'default';
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Jobs
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage and track all fire and security jobs
          </Typography>
        </Box>
        {(isAdmin || isManager) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: '#d32f2f',
              '&:hover': {
                backgroundColor: '#b71c1c',
              }
            }}
          >
            Create Job
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="assigned">Assigned</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Job Title</strong></TableCell>
              <TableCell><strong>Customer & Site</strong></TableCell>
              <TableCell><strong>Technician</strong></TableCell>
              <TableCell><strong>Scheduled Date</strong></TableCell>
              <TableCell><strong>Priority</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id} hover>
                <TableCell>
                  <Typography variant="body1" fontWeight="medium">
                    {job.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.job_type?.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {job.site?.customer?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.site?.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  {job.assigned_technician ? (
                    `${job.assigned_technician.first_name} ${job.assigned_technician.last_name}`
                  ) : (
                    <Chip label="Unassigned" size="small" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>
                  {job.scheduled_date ? (
                    format(new Date(job.scheduled_date), 'MMM dd, yyyy')
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={job.priority} 
                    color={getPriorityColor(job.priority)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={job.status} 
                    color={getStatusColor(job.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" color="primary">
                    <ViewIcon />
                  </IconButton>
                  {(isAdmin || isManager) && (
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                  )}
                  {job.status === 'assigned' && (
                    <IconButton 
                      size="small" 
                      color="success"
                      onClick={() => handleStatusUpdate(job.id, 'in_progress')}
                    >
                      <StartIcon />
                    </IconButton>
                  )}
                  {job.status === 'in_progress' && (
                    <IconButton 
                      size="small" 
                      color="success"
                      onClick={() => handleStatusUpdate(job.id, 'completed')}
                    >
                      <CompleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {jobs.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" color="text.secondary" py={3}>
                    No jobs found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={jobs.length} // This should be total count from API
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
    </Box>
  );
};

export default Jobs;
