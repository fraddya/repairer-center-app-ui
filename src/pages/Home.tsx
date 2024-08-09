import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { fetchAllJobs, fetchJobs, Job } from '../services/JobService';
import { fetchEmployees, fetchUsers, User } from '../services/userService';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import {
  Person as PersonIcon,
  Work as WorkIcon,
  AttachMoney as AttachMoneyIcon,
  Build as BuildIcon
} from '@mui/icons-material';

const Home: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newRequestJobs, setNewRequestJobs] = useState<Job[]>([]);
  const [confirmJobs, setConfirmJobs] = useState<Job[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState<any[]>([]);
  const [jobStatusData, setJobStatusData] = useState<any[]>([]);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [totalRepairs, setTotalRepairs] = useState<number>(0); // New state for total repairs

  useEffect(() => {
    // Fetch all jobs
    fetchAllJobs().then((data) => {
      setJobs(data);

      // Calculate monthly income
      const incomeData = calculateMonthlyIncome(data);
      setMonthlyIncome(incomeData);

      // Calculate job status distribution
      const statusData = calculateJobStatusData(data);
      setJobStatusData(statusData);

      // Calculate total earnings
      const earnings = calculateTotalEarnings(data);
      setTotalEarnings(earnings);
    });

    // Fetch employees
    fetchEmployees().then(setEmployees);

    // Fetch users
    fetchUsers().then(setUsers);

    // Fetch NEWREQUEST and CONFIRM jobs
    fetchJobs('NEWREQUEST').then(setNewRequestJobs);
    fetchJobs('CONFIRM').then(setConfirmJobs);

    // Fetch jobs with DONE status for total repairs
    fetchJobs('DONE').then((doneJobs) => setTotalRepairs(doneJobs.length)); // Update total repairs
  }, []);

  const calculateMonthlyIncome = (jobs: Job[]) => {
    // Calculate monthly income from jobs
    // Implement your logic here
    return [];
  };

  const calculateJobStatusData = (jobs: Job[]) => {
    // Calculate job status distribution
    return jobs.reduce((acc: any[], job) => {
      const status = job.jobStatus;
      const existingStatus = acc.find((item) => item.label === status);
      if (existingStatus) {
        existingStatus.value += 1;
      } else {
        acc.push({ label: status, value: 1 });
      }
      return acc;
    }, []);
  };

  const calculateTotalEarnings = (jobs: Job[]) => {
    // Calculate total earnings from jobs
    return jobs.reduce((acc, job) => acc + (job.estimatePrice || 0), 0);
  };

  const glassCardStyles = {
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };

  const glassContentStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '16px',
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid item xs={12} sm={6} md={3} paddingBottom={2}>
        <Card sx={glassCardStyles}>
          <CardContent sx={glassContentStyles}><h2>Hi Welcome back</h2></CardContent>
        </Card>
      </Grid>
      <Grid container spacing={3}>
        {/* Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={glassCardStyles}>
            <CardContent sx={glassContentStyles}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ fontSize: 40, marginRight: 2 }} />
                <Box>
                  <Typography variant="h6">Number of Users</Typography>
                  <Typography variant="h4" align='center'>{users.length}</Typography> {/* Number of users */}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={glassCardStyles}>
            <CardContent sx={glassContentStyles}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WorkIcon sx={{ fontSize: 40, marginRight: 2 }} />
                <Box>
                  <Typography variant="h6">Number of Employees</Typography>
                  <Typography variant="h4" align='center'>{employees.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={glassCardStyles}>
            <CardContent sx={glassContentStyles}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoneyIcon sx={{ fontSize: 40, marginRight: 2 }} />
                <Box>
                  <Typography variant="h6">Total Earnings</Typography>
                  <Typography variant="h4" align='center'>${totalEarnings.toFixed(2)}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={glassCardStyles}>
            <CardContent sx={glassContentStyles}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BuildIcon sx={{ fontSize: 40, marginRight: 2 }} />
                <Box>
                  <Typography variant="h6">Total Repairs</Typography>
                  <Typography variant="h4" align='center'>{totalRepairs}</Typography> {/* Updated to use totalRepairs */}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Income and Job Status Distribution in the same row */}
        <Grid item xs={12} md={6}>
          <Card sx={glassCardStyles}>
            <CardContent sx={glassContentStyles}>
              <Typography variant="h5">Monthly Income</Typography>
              <Box width="100%" height={300}>
                <LineChart
                  xAxis={[{ data: monthlyIncome.map((item) => item.month) }]}
                  series={[
                    {
                      data: monthlyIncome.map((item) => item.income),
                    },
                  ]}
                  width={500}
                  height={300}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={glassCardStyles}>
            <CardContent sx={glassContentStyles}>
              <Typography variant="h5">Job Status Distribution</Typography>
              <Box width="100%" height={300}>
                <PieChart
                  series={[
                    {
                      data: jobStatusData,
                      innerRadius: 30,
                      outerRadius: 100,
                      paddingAngle: 5,
                      cornerRadius: 5,
                      startAngle: -90,
                      endAngle: 180,
                      cx: 150,
                      cy: 150,
                    },
                  ]}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* MUI Table for NEWREQUEST Jobs */}
        <Grid item xs={12} md={6}>
          <Card sx={glassCardStyles}>
            <CardContent sx={glassContentStyles}>
              <Typography variant="h5">New Request Jobs</Typography>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Job Description</TableCell>
                      <TableCell align="right">Job Date and Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {newRequestJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell component="th" scope="row">
                          {job.jobDescription}
                        </TableCell>
                        <TableCell align="right">{job.jobDateAndTime}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* MUI Table for CONFIRM Jobs */}
        <Grid item xs={12} md={6}>
          <Card sx={glassCardStyles}>
            <CardContent sx={glassContentStyles}>
              <Typography variant="h5">Confirm Jobs</Typography>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Job Description</TableCell>
                      <TableCell align="right">Job Date and Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {confirmJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell component="th" scope="row">
                          {job.jobDescription}
                        </TableCell>
                        <TableCell align="right">{job.jobDateAndTime}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
