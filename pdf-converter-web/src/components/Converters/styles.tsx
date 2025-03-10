import styled from "styled-components";

export const Container = styled.div`
  padding: 20px 40px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export const Tittle = styled.h1`
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  margin: 15px;
`;

export const BodyService = styled.p`
  font-size: 1rem;
  text-align: center;
  max-width: 800px;
  margin-bottom: 32px;
  line-height: 1.6;
`;

export const ContainerServices = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

export const DivFiles = styled.div`
  display: flex;
  width: 600px;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0px;

  @media (max-width: 700px) {
    width: 320px;
  }
`;

export const FileInfo = styled.div`
  width: 600px;

  @media (max-width: 700px) {
    width: 320px;
  }
`;

export const FileName = styled.p`
  margin: 0px;
  padding: 5px;
  width: 100%;
  overflow: hidden;
  white-space: wrap;
  text-overflow: ellipsis;
`;

export const InputWrapper = styled.div`
  width: 600px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 700px) {
    width: 320px;
  }
`;

export const Label = styled.label`
  font-family: ${(props) => props.theme.fonts.body};
  color: ${(props) => props.theme.colors.white};
  font-size: 14px;
`;

export const StyledInput = styled.input`
  padding: 8px;
  border: 2px solid ${(props) => props.theme.colors.lightPurple};
  border-radius: 4px;
  background: ${(props) => props.theme.colors.secondary};
  font-family: ${(props) => props.theme.fonts.body};
  outline: none;
  transition: border-color 0.3s;
`;

export const DivSaveButton = styled.div`
  width: 600px;
  display: flex;
  justify-content: flex-end;
  position: absolute;
  bottom: -20px;
  z-index: 1;

  @media (max-width: 700px) {
    width: 320px;
  }
`;
