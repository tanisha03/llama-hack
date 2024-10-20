import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  DatePicker,
  Select,
  Space,
  Tag,
  Alert,
  Radio,
} from 'antd';
import moment from 'moment';
import AudioPlayer from './AudioPlayer';
import { getCallList, getSurveyCallList } from '@/utils/http';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Explorer = ({ data }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredData, setFilteredData] = useState(data);

  const [callData, setCallData] = useState([]);
  const [activeCallData, setActiveCallData] = useState({});

  // Date and Time Presets
  const datePresets = [
    { label: 'Last 6 hrs', value: [moment().subtract(6, 'hours'), moment()] },
    { label: 'Last 12 hrs', value: [moment().subtract(12, 'hours'), moment()] },
    { label: 'Last 24 hrs', value: [moment().subtract(24, 'hours'), moment()] },
    { label: 'Last 7 days', value: [moment().subtract(7, 'days'), moment()] },
  ];

  // Handle Date Filter Change
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    const filtered = data.filter((item) =>
      moment(item.date).isBetween(start, end),
    );
    setFilteredData(filtered);
  };

  // Open Modal with Details
  const showModal = (record) => {
    setActiveCallData(record);
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedRow(null);
  };

  function extractDataWithinParentheses(inputString) {
    // Use a regular expression to match all data within parentheses
    const regex = /\(([^)]+)\)/g;
    let matches = [];
    let match;

    // Iterate over all matches and push the content inside parentheses to the array
    while ((match = regex.exec(inputString)) !== null) {
      matches.push(match[1]);
    }

    return matches;
  }

  // Columns for the Table
  const columns = [
    {
      title: 'File',
      dataIndex: 'mp3File',
      key: 'mp3File',
      width: 480,
      render: (mp3File) => <AudioPlayer audioUrl={mp3File} />,
    },
    {
      title: 'Type',
      dataIndex: 'callType',
      key: 'callType',
      render: (callType) => {
        let color =
          callType === 'Survey Call'
            ? 'blue'
            : callType === 'fraud'
              ? 'red'
              : 'orange';
        return <Tag color={color}>{callType?.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Date & Time',
      key: 'date',
      render: (_, record) => (
        <div>
          {new Date(record?.date).toDateString()}
          {', '}
          <b>
            {new Date(`${record?.date}T${record?.time}`).toLocaleTimeString()}
          </b>
        </div>
      ),
    },
    {
      title: 'Details',
      key: 'details',
      render: (_, record) => (
        <Button onClick={() => showModal(record)}>View AI Analysis</Button>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Space>
          <Button type="primary">Escalate</Button>
          {type === 'fraud' ? (
            <Button color="danger" variant="solid">
              Release Notification
            </Button>
          ) : null}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getCallList().then((res) => setCallData(res?.data));
  }, []);

  //   useEffect(() => {
  //     getSurveyCallList().then((res) => setCallData(res?.data));
  //   }, []);

  useEffect(() => {
    console.log(callData);
  }, [callData]);

  const [mode, setMode] = useState('top');

  const handleModeChange = (e) => {
    const t = e.target.value;
    if (t === 'support') {
      getCallList().then((res) => setCallData(res?.data));
    } else {
      getSurveyCallList().then((res) => setCallData(res?.data));
    }
  };

  const columns2 = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Radio.Group
          onChange={handleModeChange}
          value={mode}
          style={{ marginBottom: 8 }}
        >
          <Radio.Button value="support">Support</Radio.Button>
          <Radio.Button value="survey">Survey</Radio.Button>
        </Radio.Group>

        {/* <Select
          placeholder="Select preset"
          onChange={(value) =>
            handleDateChange(datePresets.find((p) => p.label === value).value)
          }
        >
          {datePresets.map((preset) => (
            <Option key={preset.label} value={preset.label}>
              {preset.label}
            </Option>
          ))}
        </Select>
        <RangePicker showTime onChange={handleDateChange} /> */}
      </Space>

      <Table columns={columns} dataSource={callData} rowKey="file" />

      {/* Modal for AI Analysis */}
      {selectedRow && (
        <Modal
          title="AI Overview Analysis"
          visible={isModalVisible}
          onCancel={closeModal}
          footer={<Button onClick={closeModal}>Close</Button>}
        >
          <div>
            {activeCallData.tags.map((tag) => (
              <Tag key={tag} color="blue">
                {tag}
              </Tag>
            ))}
          </div>
          <div style={{ margin: '28px 0' }}>
            <Alert
              message="Call Summary"
              description={activeCallData.summary}
              type="warning"
              showIcon
              //   closable
            />
          </div>
          <div>
            {activeCallData?.callType === 'Survey Call' ? (
              <Table
                dataSource={[
                  {
                    name: extractDataWithinParentheses(
                      activeCallData.summary,
                    )?.[0],
                    email: extractDataWithinParentheses(
                      activeCallData.summary,
                    )?.[1],
                    age: extractDataWithinParentheses(
                      activeCallData.summary,
                    )?.[2],
                  },
                ]}
                columns={columns2}
              />
            ) : null}

            {/* {extractDataWithinParentheses(activeCallData.summary)} */}
          </div>
        </Modal>
      )}
    </div>
  );
};

// Sample Data
const sampleData = [
  {
    file: 'call_001.mp3',
    type: 'fraud',
    date: '2024-10-18 10:00:00',
    aiSummary: 'Customer called about loan interest rates.',
    aiPointer: 'Loan Inquiry',
  },
  {
    file: 'survey_003.png',
    type: 'survey',
    date: '2024-10-16 14:15:00',
    aiSummary: 'Customer feedback on service satisfaction.',
    aiPointer: 'Customer Satisfaction',
  },
  {
    file: 'survey_003.png',
    type: 'survey',
    date: '2024-10-16 14:15:00',
    aiSummary: 'Customer feedback on service satisfaction.',
    aiPointer: 'Customer Satisfaction',
  },
  {
    file: 'email_002.png',
    type: 'enquiry',
    date: '2024-10-17 09:30:00',
    aiSummary: 'Email regarding mutual fund options.',
    aiPointer: 'Mutual Funds Inquiry',
  },
  {
    file: 'email_002.png',
    type: 'enquiry',
    date: '2024-10-17 09:30:00',
    aiSummary: 'Email regarding mutual fund options.',
    aiPointer: 'Mutual Funds Inquiry',
  },
  {
    file: 'email_002.png',
    type: 'enquiry',
    date: '2024-10-17 09:30:00',
    aiSummary: 'Email regarding mutual fund options.',
    aiPointer: 'Mutual Funds Inquiry',
  },
  {
    file: 'call_001.mp3',
    type: 'fraud',
    date: '2024-10-18 10:00:00',
    aiSummary: 'Customer called about loan interest rates.',
    aiPointer: 'Loan Inquiry',
  },
  {
    file: 'call_001.mp3',
    type: 'fraud',
    date: '2024-10-18 10:00:00',
    aiSummary: 'Customer called about loan interest rates.',
    aiPointer: 'Loan Inquiry',
  },
  {
    file: 'survey_003.png',
    type: 'survey',
    date: '2024-10-16 14:15:00',
    aiSummary: 'Customer feedback on service satisfaction.',
    aiPointer: 'Customer Satisfaction',
  },
  {
    file: 'email_002.png',
    type: 'enquiry',
    date: '2024-10-17 09:30:00',
    aiSummary: 'Email regarding mutual fund options.',
    aiPointer: 'Mutual Funds Inquiry',
  },
];

export default function App() {
  return <Explorer data={sampleData} />;
}
