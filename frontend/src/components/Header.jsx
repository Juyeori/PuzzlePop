import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ImageIcon from "./ImageIcon";
import HeaderPuzzleImage from "@/assets/icons/header_puzzle.png";
import HeaderRankImage from "@/assets/icons/header_rank.png";
import HeaderShopImage from "@/assets/icons/header_shop.png";
import Logo from "@/assets/logo.png";
import { AppBar, Toolbar, Button } from "@mui/material";
import GamePageNavigation from "@/components/GamePageNavigation";

export default function Header() {
  const navigate = useNavigate();

  return (
    <HeaderBar>
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <ImageIcon imageSource={Logo} size="lg" onClick={() => navigate("/")} />
        <GamePageNavigation />

        <nav style={{ display: "flex", gap: "20px" }}>
          <ImageIcon imageSource={HeaderPuzzleImage} size="md" onClick={() => navigate("/game")} />
          <ImageIcon imageSource={HeaderRankImage} size="md" onClick={() => navigate("/rank")} />
          <ImageIcon imageSource={HeaderShopImage} size="md" onClick={() => navigate("/shop")} />
          <Button href="#" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
            Login
          </Button>
        </nav>
      </Toolbar>
    </HeaderBar>
  );
}

const HeaderBar = styled(AppBar)`
  // position: static;
  background-color: transparent;
`;

{
  /* <ImageIcon imageSource={headerPuzzleImage} size="lg" onClick={() => navigate("/game")} />
<ImageIcon imageSource={headerRankImage} size="lg" onClick={() => navigate("/rank")} />
<ImageIcon imageSource={headerShopImage} size="lg" onClick={() => navigate("/shop")} /> */
}
