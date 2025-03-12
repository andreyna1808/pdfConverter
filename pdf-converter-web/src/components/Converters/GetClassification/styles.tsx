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
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0px;
`;

export const FileInfo = styled.div`
  margin-bottom: 10px;
  width: 100%;
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
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;

  @media (max-width: 700px) {
    width: 320px;
  }
`;

export const Label = styled.label`
  font-family: ${(props) => props.theme.fonts.body};
  color: ${(props) => props.theme.colors.white};
  font-size: 14px;
`;

export const FileInputWrapper = styled.label`
  display: flex;
  width: 180px;
  justify-content: center;
  padding: 10px;
  background-color: #5a5c5a;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lightPurple};
    transition: 0.3s;
  }
`;

export const HiddenInput = styled.input`
  display: none;
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

  @media (max-width: 700px) {
    width: 320px;
  }
`;

export const DivInputs = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InputNumber = styled.input`
  width: 97%;
  background: ${(props) => props.theme.colors.secondary};
  border: 1px solid ${(props) => props.theme.colors.lightPurple};
  border-radius: 4px;
  font-family: ${(props) => props.theme.fonts.body};
  transition: border-color 0.3s;
  padding: 12px;
  cursor: text;
  margin: 5px 0px;

  &:hover {
    border-color: ${(props) => props.theme.colors.darkPurple};
  }

  &:focus {
    outline: none;
  }
`;

export const InputCheckbox = styled.input.attrs({ type: "checkbox" })`
  width: 18px;
  height: 18px;
  accent-color: ${(props) => props.theme.colors.lightPurple};
  cursor: pointer;
`;

export const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;
