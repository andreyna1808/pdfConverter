import styled from "styled-components";

export const Header = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  position: sticky;
  top: 0;
  z-index: 20;
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  flex-wrap: wrap;
  padding: 20px;
`;

export const MenuButton = styled.button`
  color: white;
  display: block;
  margin-right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;

  @media (min-width: 1000px) {
    display: none;
  }
`;

export const Title = styled.div`
  width: 100px;
  font-size: 20px;
  font-weight: 500;
  color: white;
  border-right: 1px solid white;

  a {
    color: inherit;
    text-decoration: none;
  }
`;

export const Nav = styled.nav`
  display: none;

  @media (min-width: 1000px) {
    width: 85%;
    display: flex;
    align-items: center;
    justify-content: center;

    .nav-item {
      margin-right: 10px;
      color: #ffffff;
      text-decoration: none;
      padding: 5px 10px;

      &:hover {
        color: #ffffffcc;
      }
    }

    .nav-item.active,
    .mobile-item.active {
      color: ${({ theme }) => theme.colors.lightPurple};
    }
  }
`;

export const MobileMenu = styled.div`
  position: fixed;
  inset: 0;
  z-index: 30;
  display: flex;
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

export const MobileNav = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  width: 256px;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  z-index: 2;

  .mobile-item {
    margin-bottom: 20px;
    color: #ffffff;
    text-decoration: none;

    &:hover {
      color: #ffffffcc;
    }
  }

  .nav-item.active,
  .mobile-item.active {
    color: ${({ theme }) => theme.colors.lightPurple};
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  margin-bottom: 20px;
  cursor: pointer;
  align-self: flex-start;
`;

export const NavMobile = styled.nav`
  display: flex;
  flex-direction: column;
`;
