import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const Description = styled.h2`
  font-size: 32px;
  color: #322153;
  margin-top: 48px;
  text-align: center;
`;

export const Goback = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;

  a {
    flex: 1;

    max-width: 360px;
    height: 72px;
    background: var(--primary-color);
    border-radius: 8px;
    text-decoration: none;
    
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: 100%;
    
    margin-top: 40px;

    text-align: center;
    color: #FFF;

    :hover {
      background: #2FB86E;
    }
  }

`;

