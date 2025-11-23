import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jobsAPI } from '../../services/api';

interface JobsState {
  todayJobs: any[];
  allJobs: any[];
  currentJob: any | null;
  loading: boolean;
}

const initialState: JobsState = {
  todayJobs: [],
  allJobs: [],
  currentJob: null,
  loading: false,
};

export const fetchTodayJobs = createAsyncThunk(
  'jobs/fetchToday',
  async () => {
    const today = new Date().toISOString().split('T')[0];
    const response = await jobsAPI.getJobs({ dateFrom: today, dateTo: today });
    return response.data;
  }
);

export const fetchJobDetails = createAsyncThunk(
  'jobs/fetchDetails',
  async (jobId: string) => {
    const response = await jobsAPI.getJob(jobId);
    return response.data;
  }
);

export const updateJobStatus = createAsyncThunk(
  'jobs/updateStatus',
  async ({ jobId, status }: { jobId: string; status: string }) => {
    const response = await jobsAPI.updateJobStatus(jobId, status);
    return response.data;
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodayJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodayJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.todayJobs = action.payload;
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        state.currentJob = action.payload;
      })
      .addCase(updateJobStatus.fulfilled, (state, action) => {
        const updatedJob = action.payload;
        state.todayJobs = state.todayJobs.map(job =>
          job.id === updatedJob.id ? updatedJob : job
        );
        if (state.currentJob && state.currentJob.id === updatedJob.id) {
          state.currentJob = updatedJob;
        }
      });
  },
});

export const { clearCurrentJob } = jobsSlice.actions;
export default authSlice.reducer;
