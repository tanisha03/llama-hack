import { Layout, Menu } from 'antd';
import {
  AppstoreOutlined,
  BulbOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCampaigns } from '@/utils/supabaseHelpers';
import toast from 'react-hot-toast';
import { ACTIONS } from '@/store/actions';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const { Header, Content, Sider } = Layout;

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const campaignList = useSelector((state) => state.campaigns);

  const router = useRouter();

  const items = [
    { key: '1', icon: <PieChartOutlined />, label: '' },
    { key: '2', icon: <BulbOutlined />, label: '' },
    { key: '3', icon: <ContainerOutlined />, label: '' },
  ];

  const getCampaignsList = async () => {
    const { data, error } = await getAllCampaigns();
    if (error) {
      toast.error(error.toString());
    } else {
      dispatch({
        type: ACTIONS.SET_CAMPAIGNS,
        payload: data,
      });
    }
  };

  const onClick = (e) => {
    const { key } = e;
    switch (key) {
      case '1':
        router.push('/');
        break;
      case '2':
        router.push('/ask');
        break;
    }
  };

  useEffect(() => {
    if (!campaignList.length) getCampaignsList();
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={72}>
        <div style={{ height: '20px' }} />
        <Menu
          mode="inline"
          theme="dark"
          inlineCollapsed={true}
          items={items}
          onClick={onClick}
        />
      </Sider>

      {/* Main Content */}
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: 0,
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
          }}
        >
          Insight Manager
        </Header>
        <Content
          style={{ margin: '16px', padding: '16px', background: '#fff' }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
