import React, { useEffect, useState } from "react";
import { Button, Modal, Table, notification } from "antd";
import type { ColumnsType } from "antd/es/table";
import styled from "styled-components";
import { Typography } from "antd";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";
import "./Table.css";
import SearchBar from "./SearchBar";
import MobileTable from "./MobileTable";

const { Text } = Typography;

const TableContainerDiv = styled.div`
  width: 80%;
  margin: auto;
`;

const SearchContainerDiv = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const BottomContainerDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export type Project = {
  productId: string;
  productName: string;
  productOwnerName: string;
  Developers: Array<string>;
  scrumMasterName: string;
  startDate: string;
  methodology: string;
  location: string;
};

const TablePage = () => {
  const [tableData, setTableData] = useState<Array<Project> | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  // Record is one row, or one Project type object
  const [record, setRecord] = useState<Project>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [cssClass, setCssClass] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  // scrumMaster or developer
  const [searchKey, setSearchKey] = useState<string>("scrumMaster");
  //If the window is small, set small window to true
  const [smallWindow, setSmallWindow] = useState<boolean>(false);

  const [api, contextHolder] = notification.useNotification();

  // This async function retrieves all products or can retreive specific products if the search is used
  const getProjects = async () => {
    try {
      setLoading(true);
      let response: any;
      if (searchValue) {
        response = await fetch(
          `http://localhost:3000/api/get${searchKey}Products/${searchValue}`
        );
      } else {
        response = await fetch("http://localhost:3000/api/getProducts");
      }
      const responseData = await response.json();
      //If reponse not good, throw an error
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setTableData(responseData.data);
      setLoading(false);
    } catch (err: any) {
      api.error({
        message: err.message,
        placement: "top",
      });
      setLoading(false);
    }
  };

  const updateSizeState = () => {
    if (window.innerWidth < 1100) {
      setSmallWindow(true);
    } else {
      setSmallWindow(false);
    }
  };

  useEffect(() => {
    getProjects();
    updateSizeState();
    window.addEventListener("resize", updateSizeState);
    return () => window.removeEventListener("resize", updateSizeState);
  }, [refresh]);

  const columns: ColumnsType<Project> = [
    {
      title: "Product Number",
      dataIndex: "productId",
      key: "productId",
      width: 120,
      ellipsis: {
        showTitle: true,
      },
      align: "center",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      width: 110,
      align: "center",
    },
    {
      title: "Scrum Master",
      dataIndex: "scrumMasterName",
      key: "scrumMasterName",
      width: 105,
      align: "center",
    },
    {
      title: "Product Owner",
      dataIndex: "productOwnerName",
      key: "productOwnerName",
      width: 125,
      align: "center",
    },
    {
      title: "Developer Names",
      dataIndex: "Developers",
      key: "Developers",
      render: (i, { Developers }) => (
        <>
          {Developers.map((developer, j) => {
            return (
              <p key={j} style={{ margin: "0.5px 0" }}>
                {developer}
              </p>
            );
          })}
        </>
      ),
      width: 125,
      align: "center",
    },
    {
      title: "Start Date (YYYY/MM/DD)",
      dataIndex: "startDate",
      key: "startDate",
      width: 105,
      align: "center",
    },
    {
      title: "Methodology",
      dataIndex: "methodology",
      key: "methodology",
      width: 100,
      align: "center",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (text) => (
        <a href={text} target="_blank">
          {text}
        </a>
      ),
      width: 100,
      align: "center",
      ellipsis: {
        showTitle: true,
      },
    },
    {
      title: "Edit",
      dataIndex: "edit",
      key: "edit",
      width: 75,
      render: (i, record) => (
        <Button onClick={() => showEditModal(record)}>Edit</Button>
      ),
      align: "center",
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showEditModal = (record: Project) => {
    setRecord(record);
    setIsEditModalOpen(true);
  };

  // Closes both modals and triggers refresh for useEffect to reload the products
  const handleCancel = () => {
    setRefresh(!refresh);
    setIsModalOpen(false);
    setIsEditModalOpen(false);
  };

  // Generic function to show a success notification
  const showNotification = (message: string) => {
    api.success({
      message: message,
      placement: "top",
    });
  };

  // Generic function to show an error notification
  const showNotificationError = (message: string) => {
    api.error({
      message: message,
      placement: "top",
    });
  };

  // Animation to make border go blue glow when a product is edited or added
  const changeCSS = async () => {
    setCssClass("table-row-bordered");
    await new Promise((res) => setTimeout(res, 2500));
    setCssClass("table-row-unbordered");
  };

  // Resets the search value
  const removeSearch = () => {
    setSearchValue("");
  };

  return (
    <TableContainerDiv>
      {contextHolder}
      {smallWindow ? (
        <MobileTable data={tableData} showEditModal={showEditModal} showModal={showModal} cssClass={cssClass} record={record}/>
      ) : (
        <Table
          pagination={{ pageSize: 8 }}
          // Sets every second row to darker color to easier to see rows -
          // and will add the blue glow border when there is a record state
          rowClassName={(r, index) =>
            r.productId === record?.productId
              ? index % 2 === 0
                ? `table-row-light ${cssClass}`
                : `table-row-dark ${cssClass}`
              : index % 2 === 0
              ? `table-row-light`
              : `table-row-dark`
          }
          loading={loading}
          size={"small"}
          columns={columns}
          dataSource={tableData}
          bordered
          footer={() => {
            return (
              <BottomContainerDiv>
                {tableData && (
                  <Text strong>Total Products: {tableData.length}</Text>
                )}
                <Button type="primary" onClick={showModal}>
                  Add New Product
                </Button>
              </BottomContainerDiv>
            );
          }}
        />
      )}
      <Modal
        destroyOnClose
        title="Add Product"
        open={isModalOpen}
        footer={null}
        onCancel={handleCancel}
        closable
      >
        <AddProductForm
          closeModal={handleCancel}
          showNotification={showNotification}
          setRecord={setRecord}
          changeCSS={changeCSS}
          removeSearch={removeSearch}
        />
      </Modal>
      <Modal
        destroyOnClose
        title="Edit Product"
        open={isEditModalOpen}
        footer={null}
        onCancel={handleCancel}
        closable
      >
        {record && (
          <EditProductForm
            record={record}
            closeModal={handleCancel}
            showNotification={showNotification}
            changeCSS={changeCSS}
          />
        )}
      </Modal>
    </TableContainerDiv>
  );
};

export default TablePage;
