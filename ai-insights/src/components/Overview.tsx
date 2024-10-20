import { Card, Col, Row } from 'antd';
import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useState } from 'react';

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

function Overview() {
  const [volumeData] = useState({
    calls: [100, 120, 110, 130, 140, 150, 160],
    emails: [80, 85, 90, 88, 95, 100, 105],
    wa: [70, 60, 65, 68, 75, 80, 85],
    tickets: [50, 55, 60, 65, 58, 60, 62],
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
      },
    },
  };

  const callVolumeData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Call Volume',
        data: [90, 120, 110, 190, 112, 113, 160],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const callsProcessedData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Calls Processed',
        data: [90, 160, 223, 180, 160, 170, 150],
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
    ],
  };

  const resolutionTimeData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Resolution Time (mins)',
        data: [10, 8, 12, 9, 7, 10, 9],
        backgroundColor: 'rgba(255, 159, 64, 1)',
      },
    ],
  };

  const callProcessingSourceData = {
    labels: ['AI', 'Support', 'Manual'],
    datasets: [
      {
        label: 'Processing Source',
        data: [40, 30, 30],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        hoverBackgroundColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
      },
    ],
  };

  const resolutionTopicsData = {
    labels: ['Loans', 'Mutual Funds', 'Insurance', 'Credit Cards'],
    datasets: [
      {
        label: 'Resolution Topics',
        data: [50, 30, 15, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        hoverBackgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
      },
    ],
  };
  return (
    <>
      <Row gutter={16}>
        {/* Call Volume */}
        <Col span={12}>
          <Card title="Call Volume (Last 7 Days)">
            <Line
              data={callVolumeData}
              options={{
                ...chartOptions,
                title: { text: 'Call Volume' },
              }}
            />
          </Card>
        </Col>

        {/* Calls Processed */}
        <Col span={12}>
          <Card title="Calls Processed (Last 7 Days)">
            <Line
              data={callsProcessedData}
              options={{
                ...chartOptions,
                title: { text: 'Calls Processed' },
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: '16px' }}>
        {/* Resolution Time */}
        <Col span={12}>
          <Card title="Resolution Time (Minutes)">
            <Bar
              data={resolutionTimeData}
              options={{
                ...chartOptions,
                title: { text: 'Resolution Time' },
              }}
              style={{ width: '100%', height: '100%' }}
            />
          </Card>
        </Col>

        {/* Call Processing Source (First Pie Chart) */}
        <Col span={6}>
          <Card
            title="Call Processing Source"
            style={{ width: '100%', height: '100%' }}
          >
            <Pie
              data={callProcessingSourceData}
              options={{
                ...chartOptions,
                title: { text: 'Call Processing Source' },
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          {/* Resolution Topics Weighage (Second Pie Chart) */}
          <Card
            title="Resolution Topics Weighage"
            style={{ width: '100%', height: '100%' }}
          >
            <Pie
              data={resolutionTopicsData}
              options={{
                ...chartOptions,
                title: { text: 'Resolution Topics' },
              }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Overview;
