import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Divider,
  Chip,
  CardActionArea,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { setRoomId, setSender, setTeam } from "@/socket-utils/storage";
import { request } from "../../apis/requestBuilder";
import { isAxiosError } from "axios";

export default function GameCard({ room, category }) {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState("");

  const {
    admin,
    blueTeam,
    gameId,
    gameName,
    gameType,
    started,
    picture,
    redTeam,
    roomSize,
    sessionToUser,
    startTime,
  } = room;

  const chipMessage = `${parseInt(roomSize / 2)} : ${parseInt(roomSize / 2)}`;
  const chipColorArray = ["error", "warning", "success", "info"];
  const chipColor = chipColorArray[parseInt(roomSize / 2) - 1];

  const enterRoom = async (roomId) => {
    const sender = window.prompt("닉네임을 입력해주세요");
    if (!sender) {
      return;
    }
    setSender(sender);
    setRoomId(roomId);
    setTeam("red");

    try {
      const res = await request.post(`/game/room/${roomId}`, { id: sender });
      console.log(res);
      navigate(`/game/${category}/waiting/${roomId}`);
    } catch (e) {
      if (isAxiosError(e) && e.response.status === 400) {
        window.alert("다른 닉네임을 사용해주세요.");
      }
    }
  };

  const handleClick = (event, started) => {
    if (!started) {
      enterRoom(event.currentTarget.id);
    }
  };

  const fetchImage = async () => {
    const imgRes = await request.get(`/image/${picture.id}`);
    setImgSrc(`data:image/jpeg;base64,${imgRes.data}`);
  };

  useEffect(() => {
    if (picture.encodedString === "짱구.jpg") {
      setImgSrc(
        "https://i.namu.wiki/i/1zQlFS0_ZoofiPI4-mcmXA8zXHEcgFiAbHcnjGr7RAEyjwMHvDbrbsc8ekjZ5iWMGyzJrGl96Fv5ZIgm6YR_nA.webp",
      );
    } else {
      fetchImage();
    }
  }, []);

  const theme = createTheme({
    typography: {
      fontFamily: "'Galmuri11', sans-serif",
    },
  });

  return (
    <MyCard onClick={(e) => handleClick(e, started)} id={gameId} started={started.toString()}>
      <ThemeProvider theme={theme}>
        <MyCardActionArea>
          <CardMedia
            component="img"
            sx={{ width: 151, height: 151 }}
            image={imgSrc}
            alt={picture.encodedString}
          />
          <CardContent sx={{ display: "flex", flexDirection: "column", marginRight: "3%" }}>
            {category === "battle" && <MyChip label={chipMessage} color={chipColor} />}
            <Box sx={{ width: "250px", paddingY: "15%" }}>
              <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <Typography component="div" variant="h5">
                  {gameName}
                </Typography>
                <Typography sx={{ alignSelf: "end" }} component="div" variant="subtitle2">
                  {picture.lengthPieceCnt * picture.widthPieceCnt}pcs
                </Typography>
              </Box>

              <Divider sx={{ marginY: "3%" }} />

              <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <RoomState component="div" variant="h5">
                  {started ? "Playing" : "Waiting"}
                </RoomState>
                <Typography variant="h6" color="text.secondary" component="div">
                  {redTeam.players.length + blueTeam.players.length} / {roomSize}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </MyCardActionArea>
      </ThemeProvider>
    </MyCard>
  );
}

const MyCard = styled(Card)`
  width: 460px;
  height: 150px;
  display: flex;
  position: relative;
  background-color: rgba(255, 255, 255, 0.7);
  &:hover {
    box-shadow: 5px 5px 10px lightgray;
  }
  opacity: ${(props) => {
    if (props.started === "true") {
      return 0.6;
    }
    return 1;
  }};
`;

const MyCardActionArea = styled(CardActionArea)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  &:foucs {
    outline: none;
  }
`;

const MyChip = styled(Chip)`
  position: absolute;
  top: 3%;
  right: 5%;
  align-self: end;
`;

const RoomState = styled(Typography)`
  font-weight: bold;
  color: ${(props) => {
    if (props.children === "Playing") {
      return "#f44336";
    } else {
      return "#3f51b5";
    }
  }};
`;
