import React, { useState } from "react";
import { Button, Input, Select, Space } from "antd";
import styled from "styled-components";
import { Typography } from "antd";
import { Project } from "./TablePage";

const { Title } = Typography;
const { Search } = Input;

const CustomSearch = styled(Search)`
  margin: 0 40px 0 0;
  width: 400px;
`;

const SearchTypeContainerDiv = styled.div`
  margin-bottom: 32px;
`;

const options = [
  { label: "Scrum Master", value: "scrumMaster" },
  { label: "Developer", value: "developer" },
];

const SearchBar = (props: {
  setTableData: React.Dispatch<React.SetStateAction<Project[] | undefined>>;
  showNotificationError: (message: string) => void;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  searchKey: string;
  setSearchKey: React.Dispatch<React.SetStateAction<string>>;
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onChangeSelect = ( value: string ) => {
    console.log(value)
    props.setSearchKey(value);
  };

  // Function will take searchKey (Scrum Master or Developer) and value (a name) and ask the api for a - 
  // filtered product list then refresh the table if its a good response
  const getFilteredProducts = async (value: string) => {
    setLoading(true);
    props.setSearchValue(value);
    try {
      if (!value) {
        throw new Error("Please Enter a Name");
      }
      const response = await fetch(
        `http://localhost:3000/api/get${props.searchKey}Products/${value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      props.setTableData(responseData.data);
      setLoading(false);
    } catch (err: any) {
      props.showNotificationError(err.message);
      setLoading(false);
    }
  };

  // Clears search and refreshes the table so all products show up again
  const clearSearch = () => {
    props.setSearchValue("");
    props.setRefresh(!props.refresh);
  };

  return (
    <SearchTypeContainerDiv>
      <Space.Compact>
        <Select defaultValue="scrumMaster" options={options} onChange={onChangeSelect}/>
        <CustomSearch
          placeholder="Input Name"
          loading={loading}
          enterButton
          onSearch={getFilteredProducts}
          value={props.searchValue}
          onChange={(e) => props.setSearchValue(e.currentTarget.value)}
        />
      </Space.Compact>
      <Button type="primary" onClick={clearSearch}>Clear Search</Button>
    </SearchTypeContainerDiv>
  );
};

export default SearchBar;
