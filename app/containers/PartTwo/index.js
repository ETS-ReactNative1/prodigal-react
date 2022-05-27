/**
 *
 * PartTwo
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import {
  Table,
  Tag,
  Select,
  Typography,
  Divider,
  Button,
  Layout,
  PageHeader,
} from 'antd';

export function PartTwo() {
  const userId = '173ha2'; // random alphanumeric

  // Call List
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCalls, setSelectedCalls] = useState([]);

  // All Label List
  const [allLabels, setAllLabels] = useState([]);
  const [addLabels, setAddLabels] = useState([]);
  const [deleteLabels, setDeleteLabels] = useState([]);

  const [selectDisabled, setSelectDisabled] = useState(true);

  const [buttonLoading, setButtonLoading] = useState(false);

  async function getCallList() {
    try {
      setLoading(true);
      const response = await fetch(
        'https://damp-garden-93707.herokuapp.com/getcalllist',
        {
          headers: {
            user_id: userId,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'GET',
        },
      );
      const res = await response.json();
      // console.log(res.data)
      // console.log(res.data.call_data)
      setDataSource(res.data.call_data);
    } catch (error) {
      // console.log(error);
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  }

  async function getUniqueLabels() {
    try {
      const selectChildren = [];
      setSelectDisabled(true);
      const response = await fetch(
        'https://damp-garden-93707.herokuapp.com/getlistoflabels',
        {
          headers: {
            user_id: userId,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'GET',
        },
      );
      const res = await response.json();
      const a = await res.data.unique_label_list;
      for (let index = 0; index < a.length; index += 1) {
        selectChildren.push(
          <Select.Option key={a[index]}>{a[index]}</Select.Option>,
        );
      }
      setAllLabels(selectChildren);
    } catch (error) {
      console.log(error);
    } finally {
      setSelectDisabled(false);
    }
  }

  async function getLabelOps() {
    const labelOps = [];
    for (let i = 0; i < addLabels.length; i += 1) {
      labelOps.push({ name: addLabels[i], op: 'add' });
    }
    for (let i = 0; i < deleteLabels.length; i += 1) {
      labelOps.push({ name: deleteLabels[i], op: 'remove' });
    }
    // console.log(labelOps);
    return labelOps;
  }

  async function applyLabels() {
    try {
      setButtonLoading(true);
      const labelOps = await getLabelOps();
      await fetch('https://damp-garden-93707.herokuapp.com/applyLabels', {
        headers: {
          user_id: userId,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          operation: {
            callList: selectedCalls,
            label_ops: labelOps,
          },
        }),
      });
      // const res = await response.json();
      // console.log(res.data);
      await getCallList();
      await getUniqueLabels();
    } catch (error) {
      console.log(error);
    } finally {
      setButtonLoading(false);
    }
  }

  useEffect(() => {
    getCallList();
    getUniqueLabels();
  }, []);

  const handleAddLabels = value => {
    setAddLabels(value);
    // console.log('Labels to be added to the selected call list', value);
  };

  const handleDeleteLabels = value => {
    // make function to delete labels to label_ops json
    setDeleteLabels(value);
    // console.log('Labels to be deleted to the selected call list', value);
  };
  const handleButtonClick = () => {
    applyLabels();
    setAddLabels([]);
    setDeleteLabels([]);
    setSelectedCalls([]);
    // console.log("Labels to be added to the selected call list", value)
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
      title: 'Labels',
      dataIndex: 'label_id',
      render: labels => (
        <>
          {labels.map(label => (
            <Tag color="blue" key={label}>
              {label}
            </Tag>
          ))}
        </>
      ),
      // sortDirections: ['descend', 'ascend'],
      // sorter:(row1,row2) => {

      //   return row1.label_id.length - row2.label_id.length
      // }
    },
  ];

  return (
    <Layout>
      <Helmet>
        <title>Labels - Part 2</title>
        <meta name="Part 2" content="Prodigal Assignment Part 2" />
      </Helmet>
      <PageHeader title="Prodigal Assignment" subTitle="Part 2 - Labels" />
      <Layout.Content
        style={{
          padding: '20px 50px',
        }}
      >
        <Typography.Text strong>Select Labels to be Added</Typography.Text>
        <Select
          mode="tags"
          value={addLabels}
          allowClear
          disabled={selectDisabled}
          placeholder="Select Labels to be Added"
          onChange={handleAddLabels}
          style={{
            width: '100%',
          }}
        >
          {allLabels}
        </Select>
        <Divider dashed />

        <Typography.Text strong>Select Labels to be Removed</Typography.Text>
        <Select
          mode="multiple"
          value={deleteLabels}
          allowClear
          disabled={selectDisabled}
          placeholder="Select Labels to be Removed"
          onChange={handleDeleteLabels}
          style={{
            width: '100%',
          }}
        >
          {allLabels}
        </Select>
        <Divider dashed />

        <Button
          type="primary"
          loading={buttonLoading}
          onClick={handleButtonClick}
        >
          Add & Remove labels to the Selected Calls
        </Button>
        <Divider dashed />

        <Table
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          rowKey="call_id"
          rowSelection={{
            type: 'checkbox',
            // selectedRowKeys: {selectedCalls},
            onChange: value => {
              setSelectedCalls(value);
            },
          }}
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

PartTwo.propTypes = {
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

export default compose(withConnect)(PartTwo);
