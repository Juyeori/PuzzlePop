import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import PlayPuzzle from "@/components/PlayPuzzle";
import Loading from "@/components/Loading";
import Timer from "@/components/GameIngame/Timer";
import PrograssBar from "@/components/GameIngame/ProgressBar";
import Chatting from "@/components/GameWaiting/Chatting";

import { getRoomId, getSender, getTeam } from "@/socket-utils/storage";
import { socket } from "@/socket-utils/socket";
import { parsePuzzleShapes } from "@/socket-utils/parsePuzzleShapes";
import { configStore } from "@/puzzle-core";

import comboAudioPath from "@/assets/audio/combo.mp3";
import redTeamBackgroundPath from "@/assets/redTeamBackground.gif";
import blueTeamBackgroundPath from "@/assets/blueTeamBackground.gif";
import dropRandomItemPath from "@/assets/dropRandomItem.gif";

import { Box } from "@mui/material";
import { red, blue } from "@mui/material/colors";

const { connect, send, subscribe } = socket;
const { getConfig, lockPuzzle, movePuzzle, unLockPuzzle, addPiece, addCombo, fire } = configStore;

export default function BattleGameIngamePage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState(null);
  const [time, setTime] = useState(0);
  const [ourPercent, setOurPercent] = useState(0);
  const [enemyPercent, setEnemyPercent] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [pictureSrc, setPictureSrc] = useState("");

  const bundles = useRef([]);
  const dropRandomItem = useRef(null);

  const finishGame = (data) => {
    if (data.finished === true) {
      window.alert("게임이 종료되었습니다.");
      window.location.href = `/game/battle/waiting/${roomId}`;
      return;
    }
  };

  const initializeGame = (data) => {
    setGameData(data);
    console.log("gamedata is here!", gameData, data);
    setLoading(false);
  };

  const connectSocket = async () => {
    connect(
      () => {
        console.log("@@@@@@@@@@@@@@@@ 인게임 소켓 연결 @@@@@@@@@@@@@@@@@@");
        subscribe(`/topic/game/room/${roomId}`, (message) => {
          const data = JSON.parse(message.body);
          console.log(data);

          // 1. timer 설정
          if (!data.gameType && data.time) {
            setTime(data.time);
          }

          // 2. 게임정보 받기
          if (data.gameType && data.gameType === "BATTLE") {
            initializeGame(data);
            return;
          }

          // 진행도
          if (data.redProgressPercent >= 0 && data.blueProgressPercent >= 0) {
            console.log("진행도?", data.redProgressPercent, data.blueProgressPercent);
            if (getTeam() === "red") {
              setOurPercent(data.redProgressPercent);
              setEnemyPercent(data.blueProgressPercent);
            } else {
              setOurPercent(data.blueProgressPercent);
              setEnemyPercent(data.redProgressPercent);
            }
          }

          // 우리팀 event
          if (data.message && data.team === getTeam().toUpperCase()) {
            if (data.message && data.message === "LOCKED" && data.senderId !== getSender()) {
              const { targets } = data;
              const targetList = JSON.parse(targets);
              targetList.forEach(({ x, y, index }) => lockPuzzle(x, y, index));
              return;
            }

            if (data.message && data.message === "MOVE" && data.senderId !== getSender()) {
              const { targets } = data;
              const targetList = JSON.parse(targets);
              targetList.forEach(({ x, y, index }) => movePuzzle(x, y, index));
              return;
            }

            if (data.message && data.message === "UNLOCKED" && data.senderId !== getSender()) {
              const { targets } = data;
              const targetList = JSON.parse(targets);
              targetList.forEach(({ x, y, index }) => unLockPuzzle(x, y, index));
              return;
            }

            if (data.message && data.message === "ADD_PIECE") {
              const { targets, combo, comboCnt } = data;
              const [fromIndex, toIndex] = targets.split(",").map((piece) => Number(piece));
              addPiece({ fromIndex, toIndex });

              if (combo) {
                console.log("콤보 효과 발동 !! : ", combo);
                combo.forEach(([toIndex, fromIndex, direction]) =>
                  addCombo(fromIndex, toIndex, direction),
                );

                if (comboCnt) {
                  console.log(`${comboCnt} 콤보문구 생성`);
                  const comboText = document.createElement("h2");
                  const canvasContainer = document.getElementById("canvasContainer");
                  comboText.textContent = `${comboCnt}COMBO!!`;

                  comboText.style.zIndex = 100;
                  comboText.style.position = "fixed";
                  comboText.style.left = "40%";
                  comboText.style.top = "100px";
                  comboText.style.transform = "translate(-50%, 0)";
                  comboText.style.fontSize = "30px";

                  canvasContainer.appendChild(comboText);

                  console.log(comboText);
                  setTimeout(() => {
                    console.log("콤보 문구 삭제");
                    console.log(comboText);
                    console.log(comboText.parentNode);
                    console.log(comboText.parentElement);
                    comboText.parentNode.removeChild(comboText);
                  }, 2000);
                }

                const audio = new Audio(comboAudioPath);
                audio.loop = false;
                audio.crossOrigin = "anonymous";
                // audio.volume = 0.5;
                audio.load();
                try {
                  audio.play();
                } catch (err) {
                  console.log(err);
                }
              }

              finishGame(data);
              return;
            }
          }

          if (data.message && data.message === "ATTACK") {
            console.log("공격메세지", data);
            // dropRandomItem 삭제
            dropRandomItem.current.parentNode.removeChild(dropRandomItem.current);

            const { targets, targetList, deleted, randomItem } = data;

            console.log("나 게임 인포 보낸다?");
            send(
              "/app/game/message",
              {},
              JSON.stringify({
                type: "GAME",
                message: "GAME_INFO",
                roomId: getRoomId(),
                sender: getSender(),
              }),
            );

            if (randomItem.name === "FIRE") {
              console.log("랜덤 아이템 fire 였어!");

              // // fire 당하는 팀의 효과
              // if (targets === getTeam().toUpperCase()) {

              // } else { // fire 발동하는 팀의 효과

              // }

              setTimeout(() => {
                console.log("번들 찾아볼게", bundles.current);
                if (targetList && targets === getTeam().toUpperCase()) {
                  console.log("fire 발동 !!");
                  fire(bundles.current, targetList);
                }
              }, 2000);
            }

            if (randomItem.name === "ROCKET") {
              console.log("랜덤 아이템 rocket 였어!");

              // // rocket 당하는 팀의 효과
              // if (targets === getTeam().toUpperCase()) {

              // } else { // rocket 발동하는 팀의 효과

              // }

              setTimeout(() => {
                console.log("번들 찾아볼게", bundles.current);
                if (targetList && targets === getTeam().toUpperCase()) {
                  console.log("rocket 발동 !!");
                  fire(bundles.current, targetList);
                }
              }, 2000);
            }

            if (randomItem.name === "EARTHQUAKE") {
              console.log("랜덤 아이템 earthquake 였어!");

              // // earthquake 당하는 팀의 효과
              // if (targets === getTeam().toUpperCase()) {

              // } else { // earthquake 발동하는 팀의 효과

              // }

              setTimeout(() => {
                console.log("번들 찾아볼게", bundles.current);
                if (targetList && targets === getTeam().toUpperCase()) {
                  console.log("rocket 발동 !!");
                  fire(bundles.current, targetList);
                }
              }, 2000);
            }
          }

          if (data.message && data.message === "SHIELD") {
            console.log("공격메세지 : 쉴드", data);
            // dropRandomItem 삭제
            dropRandomItem.current.parentNode.removeChild(dropRandomItem.current);
          }

          if (data.message && data.message === "MIRROR") {
            console.log("공격메세지 : 거울", data);
            // dropRandomItem 삭제
            dropRandomItem.current.parentNode.removeChild(dropRandomItem.current);
          }

          // drop random Item 생성
          if (data.message && data.message === "DROP_ITEM" && data.randomItem) {
            // 버튼 생성
            const canvasContainer = document.getElementById("canvasContainer");
            const dropRandomItemImg = document.createElement("img");
            dropRandomItemImg.src = dropRandomItemPath;

            // 버튼의 위치 설정
            dropRandomItemImg.style.position = "absolute";
            dropRandomItemImg.style.left = data.randomItem.position_x + "px";
            dropRandomItemImg.style.top = data.randomItem.position_y + "px";
            dropRandomItemImg.style.transform = "translate(-50%, -50%)";

            dropRandomItemImg.onclick = function () {
              // 부모 요소로부터 버튼 제거
              //근데 이거 다른 클라이언트들도 이 아이템 먹었다고 버튼 사라지는 이벤트 처리하든가 해야함.
              console.log("item dropRandomItemImg 클릭됨");
              canvasContainer.removeChild(dropRandomItemImg);

              // 서버로 메시지 전송
              send(
                "/app/game/message",
                {},
                JSON.stringify({
                  type: "GAME",
                  roomId: getRoomId(),
                  sender: getSender(),
                  message: "USE_RANDOM_ITEM",
                  targets: data.randomItem.uuid,
                }),
              );
            };

            // 버튼을 canvasContainer에 추가
            dropRandomItem.current = dropRandomItemImg;
            canvasContainer.appendChild(dropRandomItemImg);

            // alert 대신 메시지를 콘솔에 출력
            console.log(
              data.randomItem.name +
                " 을 " +
                data.randomItem.position_x +
                " " +
                data.randomItem.position_y +
                " 에 생성한다!",
            );

            // 3초 뒤 아이템 삭제
            setTimeout(() => {
              if (dropRandomItemImg.parentNode) {
                console.log("3초 끝남! item dropRandomItemImg 삭제");
                canvasContainer.removeChild(dropRandomItemImg);
              }
            }, 3000);
          }
        });

        // 채팅
        subscribe(`/topic/chat/room/${roomId}`, (message) => {
          const data = JSON.parse(message.body);
          console.log("채팅왔다", data);
          const { userid, chatMessage, time, teamColor } = data;
          if (teamColor === getTeam().toUpperCase()) {
            const receivedMessage = { userid, chatMessage, time }; // 받은 채팅
            setChatHistory((prevChat) => [...prevChat, receivedMessage]); // 채팅 기록에 새로운 채팅 추가
          }
        });

        // 서버로 메시지 전송
        send(
          "/app/game/message",
          {},
          JSON.stringify({
            type: "ENTER",
            roomId: getRoomId(),
            sender: getSender(),
          }),
        );
      },
      () => {
        console.log("@@@@@@@@@@@@@@@@@@@@@socket error 발생@@@@@@@@@@@@@@@@@@@@@");
        // window.alert("게임이 종료되었거나 입장할 수 없습니다.");
        // navigate(`/game/battle`, {
        //   replace: true,
        // });
      },
    );
  };

  useEffect(() => {
    if (roomId !== getRoomId() || !getSender()) {
      navigate("/game/battle", {
        replace: true,
      });
      return;
    }

    connectSocket();
    // setLoading(false);

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (gameData) {
      console.log(gameData);
      console.log(getSender(), getTeam());
      console.log(gameData[`${getTeam()}Puzzle`].board);

      const tempSrc =
        gameData.picture.encodedString === "짱구.jpg"
          ? "https://i.namu.wiki/i/1zQlFS0_ZoofiPI4-mcmXA8zXHEcgFiAbHcnjGr7RAEyjwMHvDbrbsc8ekjZ5iWMGyzJrGl96Fv5ZIgm6YR_nA.webp"
          : `data:image/jpeg;base64,${gameData.picture.encodedString}`;

      // const targetTeam = getTeam() === "red" ? "blue" : "red";
      bundles.current = gameData[`${getTeam()}Puzzle`].bundles;
      setPictureSrc(tempSrc);
      setLoading(false);
    }
  }, [gameData]);

  return (
    <Wrapper>
      {/* <h1>BattleGameIngamePage : {roomId}</h1> */}
      {loading ? (
        <Loading message="게임 정보 받아오는 중..." />
      ) : (
        gameData &&
        gameData[`${getTeam()}Puzzle`] &&
        gameData[`${getTeam()}Puzzle`].board && (
          <div>
            <>
              <Board>
                <PlayPuzzle
                  category="battle"
                  shapes={parsePuzzleShapes(
                    gameData[`${getTeam()}Puzzle`].board,
                    gameData.picture.widthPieceCnt,
                    gameData.picture.lengthPieceCnt,
                  )}
                  board={gameData[`${getTeam()}Puzzle`].board}
                  picture={gameData.picture}
                />
                <Row>
                  <ProgressWrapper>
                    <PrograssBar percent={ourPercent} isEnemy={false} />
                  </ProgressWrapper>
                  <ProgressWrapper>
                    <PrograssBar percent={enemyPercent} isEnemy={true} />
                  </ProgressWrapper>
                </Row>

                <Col>
                  <Timer num={time} />
                  <h3>이 그림을 맞춰주세요!</h3>
                  <img
                    src={pictureSrc}
                    alt="퍼즐 그림"
                    style={{ width: "100%", borderRadius: "10px", margin: "5px" }}
                  />
                  <Chatting chatHistory={chatHistory} isbattleingame="true" />
                </Col>
              </Board>
            </>

            {/* <ItemController /> */}
          </div>
        )
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100vh;
  min-height: 1000px;
  background-image: ${getTeam() === "red"
    ? `url(${redTeamBackgroundPath})`
    : `url(${blueTeamBackgroundPath})`};
`;

const Row = styled(Box)`
  display: flex;
  height: 100%;
  margin-left: 10px;
`;

const Col = styled(Box)`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  margin-left: 10px;
`;

const Board = styled.div`
  width: 1320px;
  height: 754px;
  display: flex;
  position: relative;
  top: 50px;
  margin: auto;
  padding: 2%;
  padding-right: 1.5%;
  border-radius: 20px;
  border: 3px solid ${getTeam() === "red" ? red[400] : blue[400]};
  background-color: rgba(255, 255, 255, 0.8);
`;

const ProgressWrapper = styled(Box)`
  margin: 0 1px;
  display: inline-block;
  transform: rotate(180deg);
`;
