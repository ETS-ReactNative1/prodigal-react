/**
 *
 * PartOne
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import {
  Table,
  Slider,
  Select,
  Divider,
  Layout,
  PageHeader,
  Typography,
} from 'antd';

export function PartOne() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  // Slider Data
  const defaultTimeRange = [10, 30];
  const [callMin, setCallMin] = useState(0);
  const [callMax, setCallMax] = useState(100);
  const [disabled, setDisabled] = useState(true);
  const [timeRange, setTimeRange] = useState(defaultTimeRange);
  // Filter Data
  const defaultAgents = ['Annie Ray', 'Danny Strong'];
  const [agents, setAgents] = useState(defaultAgents);
  const [allAgents, setAllAgents] = useState([]);
  const [selectDisabled, setSelectDisabled] = useState(true);

  async function getAgents() {
    try {
      const selectChildren = [];
      setSelectDisabled(true);
      const response = await fetch(
        'https://damp-garden-93707.herokuapp.com/getlistofagents',
      );
      const res = await response.json();
      const a = await res.data.listofagents;
      for (let index = 0; index < a.length; index += 1) {
        // console.log(a[index]);
        selectChildren.push(
          <Select.Option key={a[index]}>{a[index]}</Select.Option>,
        );
      }
      setAllAgents(selectChildren);
      // console.log(selectChildren)
      // console.log(res.data.listofagents)
    } catch (error) {
      console.log(error);
    } finally {
      setSelectDisabled(false);
    }
  }

  async function getMinMaxCallTime() {
    try {
      setDisabled(true);
      const response = await fetch(
        'https://damp-garden-93707.herokuapp.com/getdurationrange',
      );
      const res = await response.json();
      // console.log(res.data.minimum)
      setCallMin(res.data.minimun);
      setCallMax(res.data.maximum);
    } catch (error) {
      console.log(error);
    } finally {
      setDisabled(false);
    }
  }

  async function fetchData(timeRangeList, agentList) {
    try {
      setLoading(true);
      const response = await fetch(
        'https://damp-garden-93707.herokuapp.com/getfilteredcalls',
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            info: {
              filter_agent_list: agentList,
              filter_time_range: timeRangeList,
            },
          }),
        },
      );
      const res = await response.json();
      // console.log(res.data)
      setDataSource(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMinMaxCallTime();
    getAgents();
    fetchData(timeRange, agents);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSliderChange = value => {
    setTimeRange(value);
    fetchData(value, agents);
  };

  const handleAgentChange = value => {
    setAgents(value);
    fetchData(timeRange, value);
  };

  const columns = [
    {
      key: '1',
      title: 'Call ID',
      dataIndex: 'call_id',
      sortDirections: ['descend', 'ascend'],
      sorter: (row1, row2) => row1.call_id - row2.call_id,
    },
    {
      key: '2',
      title: 'Agent',
      dataIndex: 'agent_id',
      sortDirections: ['descend', 'ascend'],
      sorter: (row1, row2) => row1.agent_id.localeCompare(row2.agent_id),
    },
    {
      key: '3',
      title: 'Call Time',
      dataIndex: 'call_time',
      sortDirections: ['descend', 'ascend'],
      sorter: (row1, row2) => row1.call_time - row2.call_time,
    },
  ];

  return (
    <Layout>
      <Helmet>
        <title>Filters - Part 1</title>
        <meta name="Part 1" content="Prodigal Assignment Part 1" />
      </Helmet>
      <PageHeader title="Prodigal Assignment" subTitle="Part 1 - Filters" />
      <Layout.Content
        style={{
          padding: '20px 50px',
        }}
      >
        <Typography.Text strong>Select Call Time Range</Typography.Text>
        <Slider
          range={{
            draggableTrack: true,
          }}
          defaultValue={defaultTimeRange}
          min={callMin}
          max={callMax}
          disabled={disabled}
          onAfterChange={handleSliderChange}
        />
        <Divider dashed />
        <Typography.Text strong>Select Agents</Typography.Text>
        <br />
        <br />
        <Select
          mode="multiple"
          allowClear
          disabled={selectDisabled}
          placeholder="Select Agents"
          defaultValue={defaultAgents}
          onChange={handleAgentChange}
          style={{
            width: '40%',
          }}
        >
          {allAgents}
        </Select>
        <Divider dashed />
        <Typography.Text strong>Filtered Calls</Typography.Text>
        <Table
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          rowKey="call_id"
        />
      </Layout.Content>
      <Layout.Footer
        style={{
          textAlign: 'center',
        }}
      >
        Prodigal Tech Assignment ©2022 Created by Mayank Gupta
      </Layout.Footer>
    </Layout>
  );
}

PartOne.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(PartOne);
