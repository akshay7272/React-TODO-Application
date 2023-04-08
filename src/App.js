// Importing Requirements
import React from "react";
import { useState, useEffect } from "react";
import { Form, Table, Input, Button } from "antd";
import { Select, Tag } from "antd";
import { Modal } from "antd";
import { Radio } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";

function App() {
  // fetching mock json data
  const getData = () => {
    fetch("data.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setData(myJson);
      });
  };
  useEffect(() => {
    getData();
  }, []);
  ///filreererererererer
  const [filters, setFilters] = useState({ status: ["OPEN"] });

  const [searchedText, setSearchedText] = useState("");
  //setting data to fields
  const [data, setData] = useState([]);
  // Submitting Data to todo Table
  const [form] = Form.useForm();
  // const time = Date("timestamp");
  const handleSubmit = (formData) => {
    const timestamp = new Date().toISOString();
    setData([...data, { ...formData, timestamp }]);
    form.resetFields();
  };
  //storing  tags
  const { Option } = Select;
  const [selectedTags, setSelectedTags] = useState([]);
  //setting tags values
  function handleTagChange(tags) {
    setSelectedTags(tags);
  }

  // Handling change values of radiobuttons
  const [selectedValue, setSelectedValue] = useState("");
  const handleRadioChange = (e) => {
    setSelectedValue(e.target.value);
  };
  // Deleting perticular items using fetching id (with pop up confirmation)
  const onDeleteTodo = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this todo record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setData((pre) => {
          return pre.filter((todo) => todo.id !== record.id);
        });
      },
    });
  };
  // Updating todo saved values and opening  popup.
  const [isEditing, setIsEditing] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const onEditTodo = (record) => {
    setIsEditing(true);
    setEditingTodo({ ...record });
  };
  // Cancellling editing and removing popup of editing
  const resetEditing = () => {
    setIsEditing(false);
    setEditingTodo(null);
  };

  // generating random id for each todo
  const randomNumber = parseInt(Math.random() * 1000);
  // Column data for table
  const columns = [
    {
      dataIndex: "id.randomNumber",
    },
    {
      title: "Created At",
      dataIndex: "timestamp",
      sorter: (record1, record2) => {
        return record1.timestamp > record2.timestamp;
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      //sorting for title
      sorter: (a, b) =>
        a.title.localeCompare(b.title, "en", {
          sensitivity: "base",
        }),
      // Search filter for a,b,c,d Column
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return (
          String(record.title).toLowerCase().includes(value.toLowerCase()) ||
          String(record.description)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.tags).toLowerCase().includes(value.toLowerCase()) ||
          String(record.timestamp).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      //sorting for description
      sorter: (a, b) =>
        a.description.localeCompare(b.description, "en", {
          sensitivity: "base",
        }),
    },
    {
      title: "Date",
      dataIndex: "date",
      //sorting for date
      sorter: (a, b) =>
        a.date.localeCompare(b.date, "en", {
          sensitivity: "base",
        }),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      filters: [
        { text: "React", value: "React" },
        { text: "Angular", value: "Angular" },
        { text: "Vue", value: "Vue" },
      ],
      filteredValue: filters?.tags || null,
      onFilter: (value, record) => record.tags === value,
    },
    {
      title: "Status",
      dataIndex: "status",

      filters: [
        { text: "OPEN", value: "OPEN" },
        { text: "DONE", value: "DONE" },
        { text: "WORKING", value: "WORKING" },
        { text: "OVERDUE", value: "OVERDUE" },
      ],
      filteredValue: filters?.status || null,
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Delete",
      dataIndex: "",
      render: (record) => (
        //Delete icon and functionality
        <DeleteOutlined
          onClick={() => {
            onDeleteTodo(record);
          }}
          style={{ color: "red", marginLeft: "12px" }}
        />
      ),
    },
    {
      title: "Update",
      dataIndex: "",
      render: (record) => (
        //Update todo/Edit todo icon and functionality
        <EditOutlined
          onClick={() => {
            onEditTodo(record);
          }}
          style={{ color: "blue", marginLeft: "12px" }}
        />
      ),
    },
  ];

  return (
    <>
      <div className="App">
        <header className="App-header">
          {/* Main Title of Todo Application */}
          <h1 style={{ textAlign: "center" }}>Todo Application</h1>
        </header>
        {/* Top Search Field for all column search */}
        <Input.Search
          style={{
            width: "20%",
            marginLeft: "40%",
            border: "2px solid cadetblue",
            borderRadius: "6px",
          }}
          placeholder="search here"
          allowClear
          onSearch={(value) => {
            setSearchedText(value);
          }}
        />
        <div>
          {/* Form tag with final submission onFinish */}
          <Form
            style={{
              width: "50%",
              margin: "auto",
              padding: "45px",
              border: "2px solid blue",
              marginTop: "35px",
              marginBottom: "50px",
              textAlign: "center",
            }}
            form={form}
            onFinish={handleSubmit}
            fields={[
              {
                name: ["status"],
                value: "OPEN",
              },
              {
                name: ["id"],
                value: { randomNumber },
              },
            ]}
          >
            {/* Title Todo (Add New Todo) */}
            <h1 style={{ textAlign: "center" }}>Add New Todo</h1>
            {/* Hidden Id field */}
            <Form.Item name="id" hidden />
            {/* Title Field for todo title & validation for max 100 characters */}
            <Form.Item
              name="title"
              label="Title"
              required
              rules={[
                {
                  required: true,
                  message: "Please Enter Title for Todo",
                  max: 100,
                  message: "Max 100 Characters Allowed",
                },
              ]}
            >
              <Input style={{ width: "68%" }} />
            </Form.Item>
            {/* Description Field for Todo & validation for max 1000 characters */}
            <Form.Item
              name="description"
              label="Description"
              required
              rules={[
                {
                  required: true,
                  message: "Please Enter Description for your Todo",
                  max: 1000,
                  message: "Max 1000 Characters Allowed",
                },
              ]}
            >
              <Input style={{ width: "72%", marginRight: "41px" }} />
            </Form.Item>
            {/* Date Input value */}
            <Form.Item name="date" label="Due Date" format="DD-MM-YYYY">
              <Input
                type="date"
                format="DD-MM-YYYY"
                style={{ width: "70.5%", marginRight: "19px" }}
              />
            </Form.Item>
            {/* Tags multiple but only once */}
            <Form.Item name="tags" label="Tags">
              <Select
                mode="tags"
                value={selectedTags}
                onChange={handleTagChange}
                style={{ width: "68%", marginLeft: "12px" }}
              >
                <Option value="React" style={{ color: "blue" }}>
                  React
                </Option>
                <Option value="Angular" style={{ color: "red" }}>
                  Angular
                </Option>
                <Option value="Vue" style={{ color: "green" }}>
                  Vue
                </Option>
              </Select>
            </Form.Item>
            {/* Status Values */}
            <Form.Item name="status" label="Status">
              <Radio.Group
                style={{ marginLeft: "5.5%" }}
                itialValues="OPEN"
                onChange={handleRadioChange}
                value={selectedValue}
                buttonStyle="solid"
              >
                <Radio.Button value="OPEN">OPEN</Radio.Button>
                <Radio.Button value="WORKING">WORKING</Radio.Button>
                <Radio.Button value="DONE">DONE</Radio.Button>
                <Radio.Button value="OVERDUE">OVERDUE</Radio.Button>
              </Radio.Group>
            </Form.Item>
            {/* Submit Button Field */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "65%", marginLeft: "11%" }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
        {/* Table Data from mock Json as well as custom Add */}
        <Table
          dataSource={data}
          onChange={(pagination, filter) => {
            setFilters(filter);
          }}
          columns={columns}
          rowKey={(record) => record.id}
        ></Table>
        {/* Opening and closing of pop up using Modal */}
        <Modal
          title="Edit Student"
          open={isEditing}
          okText="Save"
          onCancel={() => {
            resetEditing();
          }}
          onOk={() => {
            setData((pre) => {
              return pre.map((todo) => {
                if (todo.id === editingTodo.id) {
                  return editingTodo;
                } else {
                  return todo;
                }
              });
            });
            resetEditing();
          }}
        >
          {" "}
          <label>Title</label>
          <br />
          <Input
            value={editingTodo?.title}
            onChange={(e) => {
              setEditingTodo((pre) => {
                return { ...pre, title: e.target.value };
              });
            }}
          />
          <label>Description</label>
          <br />
          <Input
            value={editingTodo?.description}
            onChange={(e) => {
              setEditingTodo((pre) => {
                return { ...pre, description: e.target.value };
              });
            }}
          />
          <label>Tags</label>
          <br />
          <Input
            value={editingTodo?.tags}
            onChange={(e) => {
              setEditingTodo((pre) => {
                return { ...pre, tags: e.target.value };
              });
            }}
          />
          <label>Due Date</label>
          <br />
          <Input
            type="date"
            format="DD-MM-YYYY"
            value={editingTodo?.date}
            onChange={(e) => {
              if (editingTodo?.date < data.map((item) => item.timestamp)) {
                alert("Due date cannot be less than timestamp");
              } else {
                setEditingTodo((pre) => {
                  return { ...pre, date: e.target.value };
                });
              }
            }}
          />
          <label>Status</label>
          <br />
          <Radio.Group
            buttonStyle="solid"
            value={editingTodo?.status}
            onChange={(e) => {
              setEditingTodo((pre) => {
                return { ...pre, status: e.target.value };
              });
            }}
          >
            <Radio.Button value="OPEN">OPEN</Radio.Button>
            <Radio.Button value="WORKING">WORKING</Radio.Button>
            <Radio.Button value="DONE">DONE</Radio.Button>
            <Radio.Button value="OVERDUE">OVERDUE</Radio.Button>
          </Radio.Group>
        </Modal>
      </div>
    </>
  );
}

export default App;
