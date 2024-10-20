import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Progress,
  Tag,
  Alert,
} from 'antd';
import {
  AppstoreOutlined,
  BulbOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { initiateSurvey } from '@/utils/http';

const { Option } = Select;

const SurveyComponent = () => {
  // States for table data and modal visibility
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [surveyModalVisible, setSurveyModalVisible] = useState(false);
  const [selectedSurveyInsights, setSelectedSurveyInsights] = useState(null);
  const [surveyList, setsurveyList] = useState([]);

  const insightsData = {
    tags: ['loan', 'agent', 'insurance', 'customer service'],
    feedback: { positive: 75, negative: 25 },
    summary:
      "The survey indicates that most respondents found the customer service team helpful and the loan application process straightforward. However, several raised concerns about the speed of loan processing and lack of timely communication. A noticeable percentage highlighted dissatisfaction with the agent's understanding of their requirements.",
    successRate: 80,
    failureRate: 20,
    totalResponses: 120,
    avgResponseTime: '5 mins',
    responseCompletionRate: 95,
  };

  // Sample survey data
  const surveys = [
    {
      key: '1',
      name: 'Customer Satisfaction Survey',
      cohort: 'Q3-2024',
      callsCompleted: 80,
      totalCalls: 100,
      insights:
        'AI detected that most customers are satisfied with online services.',
    },
    {
      key: '2',
      name: 'Loan Inquiry Survey',
      cohort: 'Q4-2023',
      callsCompleted: 50,
      totalCalls: 75,
      insights: 'AI insights indicate interest in more flexible loan plans.',
    },
  ];

  // Table columns
  const columns = [
    {
      title: 'Survey Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Cohort',
      dataIndex: 'cohort',
      key: 'cohort',
    },
    {
      title: 'Number of Calls',
      dataIndex: 'callsCompleted',
      key: 'calls',
      render: (text, record) => (
        <Progress
          percent={Math.round(
            (record.callsCompleted / record.totalCalls) * 100,
          )}
          format={(percent) => `${record.callsCompleted}/${record.totalCalls}`}
        />
      ),
    },
    {
      title: 'AI Insights',
      key: 'insights',
      render: (text, record) => (
        <Button onClick={() => showInsights(record.insights)}>
          View Insights
        </Button>
      ),
    },
  ];

  // Show AI Insights Modal
  const showInsights = (insights) => {
    setSelectedSurveyInsights(insights);
    setIsModalVisible(true);
  };

  // Close AI Insights Modal
  const handleCancelInsights = () => {
    setIsModalVisible(false);
    setSelectedSurveyInsights(null);
  };

  // Show Create Survey Modal
  const showCreateSurveyModal = () => {
    setSurveyModalVisible(true);
  };

  // Close Create Survey Modal
  const handleCreateSurveyCancel = () => {
    setSurveyModalVisible(false);
  };

  // Handle Survey Creation (Submit form)
  const handleCreateSurvey = (values) => {
    console.log('Survey Created: ', values);
    initiateSurvey(values?.about);
    setsurveyList((prevValue) => [
      ...prevValue,
      {
        key: values?.surveyName,
        name: values?.surveyName,
        cohort: 'Q3-2024',
        callsCompleted: 0,
        totalCalls: values?.numCalls,
        insights:
          'AI detected that most customers are satisfied with online services.',
      },
    ]);
    setSurveyModalVisible(false);
  };

  const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ];

  const columns2 = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  return (
    <div>
      {/* Create New Survey Button */}
      <Button
        type="primary"
        onClick={showCreateSurveyModal}
        style={{ float: 'right' }}
      >
        Create New Survey
      </Button>

      {/* Surveys Table */}
      <Table
        columns={columns}
        dataSource={surveyList}
        style={{ marginTop: '60px' }}
      />

      {/* AI Insights Modal */}
      <Modal
        title="AI Insights"
        visible={isModalVisible}
        onCancel={handleCancelInsights}
        footer={null}
        width={1000}
      >
        {/* Tags section */}
        {/* <h3>Tags People are Most Talking About</h3> */}
        <div>
          {insightsData.tags.map((tag) => (
            <Tag key={tag} color="blue">
              {tag}
            </Tag>
          ))}
        </div>

        {/* Feedback section */}
        <h3>Feedback</h3>
        <div>
          <Progress
            percent={insightsData.feedback.positive}
            success={{ percent: insightsData.feedback.positive }}
            showInfo
            status="active"
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            format={(percent) => `Positive: ${percent}%`}
          />
          <Progress
            percent={insightsData.feedback.negative}
            status="exception"
            showInfo
            strokeColor="#f5222d"
            format={(percent) => `Negative: ${percent}%`}
          />
        </div>

        {/* Survey Outcome Summary */}
        <div style={{ margin: '28px 0' }}>
          <Alert
            message="Survey Outcome Summary"
            description={insightsData.summary}
            type="warning"
            showIcon
            //   closable
          />
        </div>
        {/* <p>{insightsData.summary}</p> */}

        {/* Success/Failure Rate */}
        {/* <h3>Success Rate</h3>
        <Progress
          percent={insightsData.successRate}
          success={{ percent: insightsData.successRate }}
          showInfo
          status="active"
        /> */}
        {/* <p>Success Rate: {insightsData.successRate}%</p> */}
        {/* <p>Failure Rate: {insightsData.failureRate}%</p> */}

        {/* Additional Metrics */}
        <h3>Leads</h3>
        {/* <h2>Table</h2> */}
        <Table dataSource={dataSource} columns={columns2} />
        {/* <div>
          <p>
            <strong>Total Responses:</strong> {insightsData.totalResponses}
          </p>
          <p>
            <strong>Average Response Time:</strong>{' '}
            {insightsData.avgResponseTime}
          </p>
          <p>
            <strong>Response Completion Rate:</strong>{' '}
            {insightsData.responseCompletionRate}%
          </p>
        </div> */}
      </Modal>

      {/* Create Survey Modal */}
      <Modal
        title="Create New Survey"
        visible={surveyModalVisible}
        onCancel={handleCreateSurveyCancel}
        footer={null}
        width={800}
      >
        <Form layout="vertical" onFinish={handleCreateSurvey}>
          <Form.Item
            name="surveyName"
            label="Survey Name"
            rules={[
              { required: true, message: 'Please input the survey name!' },
            ]}
          >
            <Input placeholder="Enter survey name" />
          </Form.Item>

          <Form.Item
            name="cohort"
            label="Cohort"
            rules={[{ required: true, message: 'Please select a cohort!' }]}
          >
            <Select placeholder="Select a cohort">
              <Option value="Q3-2024">Q3-2024</Option>
              <Option value="Q4-2023">Q4-2023</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="about"
            label="What is the survey about?"
            rules={[
              { required: true, message: 'Please provide the survey details!' },
            ]}
          >
            <Input.TextArea rows={8} placeholder="Describe the survey" />
          </Form.Item>

          {/* <Form.Item
            name="generatedQuestions"
            label="Generated Questions"
            rules={[
              {
                required: true,
                message: 'Please input the generated questions!',
              },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Enter questions" />
          </Form.Item> */}

          <Form.Item
            name="numCalls"
            label="Number of Calls"
            rules={[
              { required: true, message: 'Please input the number of calls!' },
            ]}
          >
            <Input type="number" placeholder="Enter number of calls" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Survey
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SurveyComponent;
