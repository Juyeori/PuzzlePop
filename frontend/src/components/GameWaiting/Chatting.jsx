import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import GameOpenVidu from "@/components/GameIngame/openvidu/GameOpenVidu";
import { getSender, getRoomId, getTeam } from "@/socket-utils/storage";
import { socket } from "@/socket-utils/socket";
import { TextField, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { red, blue, deepPurple } from "@mui/material/colors";

const { send } = socket;

export default function Chatting({ chatHistory, isbattleingame = false }) {
  const [message, setMessage] = useState("");
  const [lastHeight, setLastHeight] = useState(null);
  const chatElement = useRef();

  const handleMessageSend = (e) => {
    e.preventDefault();
    if (getSender() && message) {
      send(
        `/app/game/message`,
        {},
        JSON.stringify({
          roomId: getRoomId(),
          sender: getSender(),
          message,
          type: "CHAT",
        }),
      );
      setMessage("");
    }
  };

  useEffect(() => {
    const { scrollTop, scrollHeight, clientHeight } = chatElement.current;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      chatElement.current.scrollTop = scrollHeight;
      return;
    }

    if (!lastHeight) {
      chatElement.current.scrollTop = scrollHeight;
    } else {
      if (scrollTop === 0) {
        const diff = scrollHeight - lastHeight;
        chatElement.current.scrollTop = diff;
      }
    }
  }, [chatHistory, lastHeight]);

  const theme = createTheme({
    typography: {
      fontFamily: "'Galmuri11', sans-serif",
    },
    palette: {
      redTeam: {
        light: red[300],
        main: red[400],
        dark: red[500],
        darker: red[600],
        contrastText: "#fff",
      },
      blueTeam: {
        light: blue[300],
        main: blue[400],
        dark: blue[500],
        darker: blue[600],
        contrastText: "#fff",
      },
      purple: {
        light: deepPurple[200],
        main: deepPurple[300],
        dark: deepPurple[400],
        darker: deepPurple[600],
        contrastText: "#fff",
      },
    },
  });

  const currentTheme = !isbattleingame ? "purple" : getTeam() === "red" ? "redTeam" : "blueTeam";

  return (
    <ThemeProvider theme={theme}>
      <Wrapper isbattleingame={isbattleingame}>
        {chatHistory && (
          <div ref={chatElement} style={{ flexGrow: 1, margin: "10px", overflow: "scroll" }}>
            {/* 채팅 기록을 화면에 출력 */}
            {chatHistory.map((chat, index) => (
              <div key={index}>
                <strong>{chat.userid}: </strong>
                {chat.chatMessage}
              </div>
            ))}
          </div>
        )}

        <Form onSubmit={handleMessageSend}>
          {isbattleingame ? (
            <GameOpenVidu
              gameId={`${getRoomId()}_${getTeam()}`}
              playerName={getSender()}
              color={currentTheme}
            />
          ) : (
            <GameOpenVidu gameId={getRoomId()} playerName={getSender()} />
          )}
          <ChatInput
            type="text"
            placeholder="채팅"
            size="small"
            color={currentTheme}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <ChatBtn variant="outlined" color={currentTheme} type="submit">
            Send
          </ChatBtn>
        </Form>
      </Wrapper>
    </ThemeProvider>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: ${(props) => {
    if (props.isbattleingame) {
      return "750px";
    } else {
      return "200px";
    }
  }};
  margin: 0 3px;
`;

const Form = styled.form`
  height: 50px;
  display: flex;
`;

const ChatInput = styled(TextField)`
  width: 74%;
  height: 100%;
  margin-left: auto;
`;

const ChatBtn = styled(Button)`
  width: 16%;
  margin-left: 4px;
  height: 80%;
`;