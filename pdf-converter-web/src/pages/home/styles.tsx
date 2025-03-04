import styled from "styled-components";

export const Container = styled.div`
  padding: 20px 40px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Tittle = styled.h1`
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  margin: 15px;
`;

export const ContainerServices = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
  margin-top: 20px;
`;

export const Service = styled.div`
  width: 400px;
  margin: 20px;
  padding: 10px;
  background: #5a5c5a;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lightPurple};
    transition: 0.2s;
  }
`;

export const NameService = styled.h6`
  text-align: center;
  font-size: 25px;
  margin: 10px 0px;
  font-weight: bold;
`;

export const BodyService = styled.p`
  font-size: 1rem;
  text-align: center;
  max-width: 600px;
  margin-bottom: 32px;
  line-height: 1.6;
`;
