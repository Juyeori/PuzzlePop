import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "@/components/Header";
import imgPath from "@/assets/backgrounds/puzzle.gif";
import logoPath from "@/assets/logo.png";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <HomeImg src={imgPath} />
      <Container>
        <SubTitle>협동 배틀 퍼즐게임</SubTitle>
        <Logo src={logoPath} />
        <LogoTitle>
          <span style={{ color: "#f9c444" }}>Puzzle</span>{" "}
          <span style={{ color: "#ed8f88" }}>Pop</span>
        </LogoTitle>
        <EnterGame onClick={() => navigate("/game")}>Enter Game</EnterGame>
      </Container>
    </>
  );
}

const HomeImg = styled.img`
  height: 150vh;
  position: fixed;
  top: -160px;
  left: 52%;
  transform: translate(-50%, 0);
  z-index: -1;
  opacity: 0.3;
`;

const SubTitle = styled.div`
  color: #555;
  font-weight: bold;
  font-size: 30px;
`;

const Container = styled.div`
  width: 100vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  -webkit-animation: bounce-in-bck 1.1s both;
  animation: bounce-in-bck 1.1s both;
`;

const Logo = styled.img`
  width: 260px;
`;

const LogoTitle = styled.h1`
  font-family: "Galmuri11", sans-serif;
  font-weight: bold;
  font-size: 35px;
  text-shadow: 4px 4px 0px #555;
`;

const EnterGame = styled.div`
  color: #fff;
  font-family: "Galmuri11", sans-serif;
  font-weight: bold;
  font-size: 65px;
  text-shadow:
    4px 4px 0px #c4b6fb,
    8px 8px 0px #ab84e3,
    12px 12px 0px #ebe7fa;
  // text-shadow:
  //   4px 4px 0px #83d9ec,
  //   8px 8px 0px #329fba,
  //   12px 12px 0px #d1e3ff;
  transition: all 0.4s;
  cursor: pointer;

  &:hover {
    color: #555;
    font-size: 70px;
  }
`;
