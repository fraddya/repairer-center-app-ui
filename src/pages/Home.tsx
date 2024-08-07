import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';
import { LineChart, Line, PieChart, Pie, Tooltip, Legend, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { fetchAllJobs, fetchJobs , Job} from '../services/JobService';
import { fetchEmployees , User} from '../services/userService';

const Home: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [newRequestJobs, setNewRequestJobs] = useState<Job[]>([]);
  const [confirmJobs, setConfirmJobs] = useState<Job[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState<any[]>([]);
  const [jobStatusData, setJobStatusData] = useState<any[]>([]);

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
    });

    // Fetch employees
    fetchEmployees().then(setEmployees);

    // Fetch NEWREQUEST and CONFIRM jobs
    fetchJobs('NEWREQUEST').then(setNewRequestJobs);
    fetchJobs('CONFIRM').then(setConfirmJobs);
  }, []);

  const calculateMonthlyIncome = (jobs: Job[]) => {
    // Calculate monthly income from jobs
    // Implement your logic here
    return [];
  };

  const calculateJobStatusData = (jobs: Job[]) => {
    // Calculate job status distribution
    // Implement your logic here
    return [];
  };

  return (
    <Container>
      <Grid container spacing={3}>
        {/* Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5">Number of Users</Typography>
              <Typography variant="h6">{/* Number of users */}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5">Number of Employees</Typography>
              <Typography variant="h6">{employees.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5">Total Earnings</Typography>
              <Typography variant="h6">{/* Total earnings */}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5">Total Repairs</Typography>
              <Typography variant="h6">{/* Total repairs */}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Line Chart for Monthly Income */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5">Monthly Income</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyIncome}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart for Job Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Job Status Distribution</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie dataKey="value" data={jobStatusData} fill="#8884d8" label />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Lists for NEWREQUEST and CONFIRM Jobs */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">NEWREQUEST Jobs</Typography>
              <List>
                {newRequestJobs.map((job) => (
                  <ListItem key={job.id}>
                    <ListItemText primary={job.jobDescription} secondary={job.jobDateAndTime} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">CONFIRM Jobs</Typography>
              <List>
                {confirmJobs.map((job) => (
                  <ListItem key={job.id}>
                    <ListItemText primary={job.jobDescription} secondary={job.jobDateAndTime} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
