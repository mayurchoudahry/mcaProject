import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2'; // Use Line chart for history
import 'chart.js/auto';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';

const ProgressTracker = () => {
  const { userId } = useAuth(); // Get userId from Auth context
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null); // Track selected topic for detailed history

  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId) {
        setError('User not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/progress/${userId}`);
        setProgressData(response.data);
      } catch (error) {
        setError('Error fetching progress: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);

  // Function to group data by topic and calculate average score and total attempts
  const groupByTopicAndCalculateAverage = (data) => {
    const topicScores = {};

    data.forEach((result) => {
      const { topic, score } = result;
      if (!topicScores[topic]) {
        topicScores[topic] = { totalScore: 0, count: 0, records: [] };
      }
      topicScores[topic].totalScore += score;
      topicScores[topic].count += 1;
      topicScores[topic].records.push(score); // Store each score for history
    });

    return Object.keys(topicScores).map((topic) => ({
      topic,
      averageScore: topicScores[topic].totalScore / topicScores[topic].count, // Calculate average score
      attempts: topicScores[topic].count, // Total attempts for each topic
      records: topicScores[topic].records, // Array of individual scores for the topic
    }));
  };

  // Group the data by topic and calculate the average score and attempts
  const groupedData = groupByTopicAndCalculateAverage(progressData);

  // Prepare data for the chart (bar chart for average score)
  const chartData = {
    labels: groupedData.map((result) => `${result.topic} (${result.attempts} attempts)`),
    datasets: [
      {
        label: 'Average Score',
        data: groupedData.map((result) => result.averageScore),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for topic-specific history (line chart for score history)
  const selectedTopicData = groupedData.find((topicData) => topicData.topic === selectedTopic);
  const historyChartData = selectedTopicData
    ? {
        labels: selectedTopicData.records.map((_, index) => `Attempt ${index + 1}`),
        datasets: [
          {
            label: `Scores for ${selectedTopic}`,
            data: selectedTopicData.records,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            fill: false,
            borderWidth: 2,
            tension: 0.2,
          },
        ],
      }
    : null;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  return (
    <div className='min-h-screen w-screen bg-gradient-to-r from-purple-800 via-black to-blue-900 text-white flex flex-col'>
      <NavBar />
      <main className='flex flex-col items-center justify-center flex-grow p-10'>
        <h1 className='text-4xl font-bold mb-6'>Progress Tracker</h1>

        <div className='max-w-4xl w-full mb-8'>
          <Bar data={chartData} />
        </div>

        <div className='max-w-4xl w-full'>
          <h2 className='text-2xl font-bold mb-4'>View Previous Records by Topic</h2>
          <select
            className='p-2 bg-white text-black rounded mb-4'
            value={selectedTopic || ''}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value=''>Select a Topic</option>
            {groupedData.map((topicData) => (
              <option key={topicData.topic} value={topicData.topic}>
                {topicData.topic}
              </option>
            ))}
          </select>

          {selectedTopic && historyChartData ? (
            <div className='w-full'>
              <Line data={historyChartData} />
            </div>
          ) : (
            <p>Please select a topic to view its detailed score history.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProgressTracker;
