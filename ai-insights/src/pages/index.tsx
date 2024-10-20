import { Tabs, Card, Row, Col, Tag, Button, Modal } from 'antd';
import { useState } from 'react';

import DashboardLayout from '@/components/Layout';

const { TabPane } = Tabs;

import { Line, Bar, Pie } from 'react-chartjs-2';
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
import Trends from '@/components/Trends';
import Overview from '@/components/Overview';
import Survey from '@/components/Survey';
import Explorer from '@/components/Explorer';

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

const HomePage = () => {
  return (
    <DashboardLayout>
      <Tabs defaultActiveKey="1">
        {/* Overview Tab */}
        <TabPane tab="Overview" key="1">
          <Overview />
        </TabPane>

        {/* Trends Tab */}
        {/* <TabPane tab="Trends" key="2">
          <Trends />
        </TabPane> */}

        {/* Surveys Tab */}
        <TabPane tab="Surveys" key="3">
          <Survey />
        </TabPane>

        <TabPane tab="Explorer" key="4">
          <Explorer />
        </TabPane>
      </Tabs>
    </DashboardLayout>
  );
};

export default HomePage;
