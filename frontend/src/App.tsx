import React from 'react';
import Tables from './Comopnents/TablePage';
import styled from 'styled-components';
import Toolbar from './Comopnents/Toolbar';

const ContainerDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

function App() {
  return (
    <ContainerDiv >
      <Toolbar/>
      <Tables />
    </ContainerDiv>
  );
}

export default App;
