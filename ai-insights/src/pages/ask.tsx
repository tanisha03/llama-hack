import { useState } from 'react';
import { Input, Button, Select, List, Form } from 'antd';
import { ArrowRightOutlined, SendOutlined } from '@ant-design/icons'; // Icon for the send button
import styles from '../styles/AIAssistant.module.css'; // Add custom styling if needed
import DashboardLayout from '@/components/Layout';

const { TextArea } = Input;
const { Option } = Select;

const AIAssistant = () => {
  const [chatVisible, setChatVisible] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedOption, setSelectedOption] = useState('report');

  // Handle form submission
  const handleSubmit = () => {
    if (inputText.trim()) {
      const userMessage = {
        sender: 'user',
        message: inputText,
      };

      // Add user message to conversation
      setConversation([...conversation, userMessage]);

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          sender: 'ai',
          message: `Structured data for ${selectedOption} generated for: ${inputText}`,
        };
        setConversation((prevConversation) => [
          ...prevConversation,
          aiResponse,
        ]);
      }, 1000);

      setInputText('');
      setChatVisible(true);
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.aiAssistantContainer}>
        {/* Chat-like interface */}
        {chatVisible && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'space-between',
              height: '100%',
            }}
          >
            <div className={styles.chatContainer}>
              <List
                itemLayout="vertical"
                dataSource={conversation}
                renderItem={(item) => (
                  <List.Item
                    className={
                      item.sender === 'user'
                        ? styles.userMessage
                        : styles.aiMessage
                    }
                  >
                    <div style={{ padding: '2px 12px' }}>{item.message}</div>
                  </List.Item>
                )}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <Input
                type="text"
                placeholder="Ask me anything!"
                value={inputText}
                style={{ height: '40px' }}
                onChange={(e) => setInputText(e.target.value)}
              />
              <Button
                type="primary"
                shape="circle"
                icon={<ArrowRightOutlined />}
                onClick={handleSubmit}
                style={{
                  position: 'absolute',
                  right: '4px',
                  bottom: '4px',
                }}
              />
            </div>
          </div>
        )}

        {/* Input box with dropdown and submit button */}
        {!chatVisible ? (
          <Form onFinish={handleSubmit}>
            <div style={{ position: 'relative' }}>
              <Form.Item>
                <TextArea
                  rows={8}
                  placeholder="What do you want to know?"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </Form.Item>

              {/* Borderless select for options */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  position: 'absolute',
                  width: '740px',
                  bottom: '-12px',
                }}
              >
                <Form.Item>
                  <Select
                    style={{ width: '180px' }}
                    bordered={false}
                    value={selectedOption}
                    onChange={(value) => setSelectedOption(value)}
                  >
                    <Option value="report">Report Generation</Option>
                    <Option value="analysis">Analysis Extraction</Option>
                    <Option value="summary">Summary View</Option>
                    <Option value="data-extraction">Data Extraction</Option>
                  </Select>
                </Form.Item>

                {/* Submit button */}
                <Form.Item>
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<ArrowRightOutlined />}
                    htmlType="submit"
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default AIAssistant;
