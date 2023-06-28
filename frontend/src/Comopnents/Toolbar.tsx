import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Typography } from "antd";

const { Title } = Typography;


const ToolbarDiv = styled.div`
  height: 50px;
  width: 100%;
  margin: 0 0 40px 0;
  padding: 0;
  box-shadow: 0 5px 7px 0 rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  align-items: center;
  @media(max-width: 949px) {
    grid-template-columns: 1fr;
    justify-content: center;
    align-content: center;
  }
`;

// Will show green background when server is healthy and red when not
const HealthyEndpointDiv = styled.div<{ healthy: boolean }>`
  background-color: ${(props) => (props.healthy ? "#73d13d" : "#ff4d4f")};
  height: 32px;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin-right: 10px;
  @media(max-width: 949px) {
    width: 95%;
    margin: auto;
  }
`;

const CustomTitle = styled(Title)`
  margin: 0;
  padding: 0;
  margin: auto;
`

const Toolbar = () => {
  const [healthy, setHealthy] = useState<boolean>(true);
   //If the window is small, set small window to true
   const [smallWindow, setSmallWindow] = useState<boolean>(false);

  // Check endpoint to ensure server is healthy will change healthy div to green (good response) or red (bad response)
  const getHealth = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/healthEndpoint");
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setHealthy(true);
    } catch (err) {
      setHealthy(false);
    }
  };

  const updateSizeState = () => {
    if (window.innerWidth < 950) {
      setSmallWindow(true);
    } else {
      setSmallWindow(false);
    }
  };

  useEffect(() => {
    getHealth();
    window.addEventListener("resize", updateSizeState);
    return () => window.removeEventListener("resize", updateSizeState);
  }, []);

  return (
    <ToolbarDiv>
      <div></div>
      {!smallWindow && <CustomTitle level={4}>ECC Products Currently Being Developed or Maintained</CustomTitle>}
      <HealthyEndpointDiv healthy={healthy}>
        Server is {healthy ? "" : "Not"} Healthy
      </HealthyEndpointDiv>
    </ToolbarDiv>
  );
};

export default Toolbar;
