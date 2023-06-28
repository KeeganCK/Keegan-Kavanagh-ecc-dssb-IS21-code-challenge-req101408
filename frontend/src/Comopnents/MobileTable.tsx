import React from "react";
import { Button, Card } from "antd";
import { Project } from "./TablePage";
import styled from "styled-components";
import { Typography } from 'antd';

const { Title } = Typography;

const CardTableDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  align-items: center;
	grid-gap: 20px;
  @media (max-width: 780px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    width: 310px;
    margin: auto;
  }
`;

const ContainerDiv = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`

const CustomButton = styled(Button)`
  margin: 10px 0;
	width: 200px;
`;

const CustomTitle = styled(Title)`
	margin: 0 0 10px 0;
`

const CustomCard = styled(Card)`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
	width: 350px;
  .antd-card.antd-card-body{
		padding: 10px !important;
	}
	height: 410px;
`;

const TitleDiv = styled.div`
	grid-template-columns: 0.8fr 1fr;
	display: grid;
	grid-gap: 3px;
	font-weight: 600;
`

const CustomP = styled.p`
  margin: 2px;
	white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
	grid-column: 2;
	font-weight: 400;
`;


const MobileTable = (props: {
  data: Array<Project> | undefined;
  showEditModal: (record: Project) => void;
  showModal: () => void;
	cssClass: string;
	record: Project | undefined;
}) => {
  return (
    <ContainerDiv>
      <CustomButton type="primary" onClick={props.showModal}>
        Add New Product
      </CustomButton>
			<CustomTitle level={4}>Total Products: {props.data?.length}</CustomTitle>
      <CardTableDiv>
        {props.data &&
          props.data.map((product, i) => (
            <CustomCard
							className={product.productId === props.record?.productId ? props.cssClass : ""}
							key={i}
              title={`Product Name: ${product.productName}`}
              style={{ width: 350 }}
              extra={
                <Button onClick={() => props.showEditModal(product)}>
                  Edit
                </Button>
              }
            >
              <TitleDiv>Product Number: <CustomP>{product.productId}</CustomP></TitleDiv>
              <TitleDiv>Scrum Master: <CustomP>{product.scrumMasterName}</CustomP></TitleDiv>
              <TitleDiv>Product Owner: <CustomP>{product.productOwnerName}</CustomP></TitleDiv>
              <TitleDiv>Developer Names: {product.Developers.map((name, j) => <CustomP key={j}>{name}</CustomP>)}</TitleDiv>
              <TitleDiv>Start Date: <CustomP>{product.startDate}</CustomP></TitleDiv>
              <TitleDiv>Methodology: <CustomP>{product.methodology}</CustomP></TitleDiv>
              <TitleDiv>Location: <CustomP><a href={product.location} target="_blank">{product.location}</a></CustomP></TitleDiv>
            </CustomCard>
          ))}
      </CardTableDiv>
    </ContainerDiv>
  );
};

export default MobileTable;