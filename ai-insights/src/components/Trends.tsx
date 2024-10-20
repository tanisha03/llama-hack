import { Button, Card, Modal, Tag } from 'antd';
import { Line } from 'react-chartjs-2';
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

const Trends = () => {
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

  const insights = [
    {
      title: 'Loan Enquiry',
      summary: 'Increasing trend in loan enquiries.',
      percentage: '30%',
      type: 'threat',
    },
    {
      title: 'Account Issues',
      summary: 'Decrease in complaints regarding account issues.',
      percentage: '10%',
      type: 'opportunity',
    },
    {
      title: 'Technical Support',
      summary: 'Slight rise in technical support calls.',
      percentage: '25%',
      type: 'correlation',
    },
  ];

  // Data for the chart
  const chartData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Calls',
        data: volumeData.calls,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Emails',
        data: volumeData.emails,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
      {
        label: 'WhatsApp',
        data: volumeData.wa,
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
      },
      {
        label: 'Support Tickets',
        data: volumeData.tickets,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState(null);

  const showModal = (insight) => {
    setSelectedTrend(insight);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedTrend(null);
  };

  const getTagColor = (type) => {
    switch (type) {
      case 'threat':
        return 'blue';
      case 'opportunity':
        return 'green';
      case 'correlation':
        return 'purple';
      default:
        return 'default';
    }
  };

  return (
    <div>
      <div>
        {insights.map((insight, index) => (
          <Card
            hoverable
            key={index}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{insight.title}</span>
                <Tag color={getTagColor(insight.type)}>{insight.type}</Tag>
              </div>
            }
            style={{ width: '100%' }}
            extra={
              <Button onClick={() => showModal(insight)}>Drill Down</Button>
            }
          >
            <p>{insight.summary}</p>
            <p>{insight.percentage}% of total call volume</p>
          </Card>
        ))}
      </div>

      {/* Full Height Modal for Graph */}
      {selectedTrend && (
        <Modal
          title={`${selectedTrend.title} Trend`}
          visible={isModalVisible}
          onCancel={closeModal}
          footer={null}
          width="80%"
        >
          <div style={{ padding: '20px', height: '100%' }}>
            <Button style={{ float: 'right' }} onClick={closeModal}>
              Close
            </Button>
            <Line data={chartData} options={chartOptions} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Trends;
