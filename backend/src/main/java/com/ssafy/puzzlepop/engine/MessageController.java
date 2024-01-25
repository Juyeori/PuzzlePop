package com.ssafy.puzzlepop.engine;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
@EnableScheduling
public class MessageController {

    @Autowired
    private GameService gameService;
    private final SimpMessageSendingOperations sendingOperations;

    @MessageMapping("/game/message")
    public void enter(InGameMessage message) {
        if (InGameMessage.MessageType.ENTER.equals(message.getType())) {
            message.setMessage(message.getSender()+"님이 입장하였습니다.");
        }

        if (message.getType().equals(InGameMessage.MessageType.ENTER)) {
            System.out.println(gameService.findById(message.getRoomId()).getGameName() + "에 " + message.getSender() + "님이 입장하셨습니다.");
            gameService.findById(message.getRoomId()).getRedTeam().addPlayer(new User(message.getSender()));
            sendingOperations.convertAndSend("/topic/game/room/"+message.getRoomId(),message);
        } else {
            if (message.getMessage().equals("gameStart")) {
                System.out.println("game start");
                Game game = gameService.startGame(message.getRoomId());
                sendingOperations.convertAndSend("/topic/game/room/"+message.getRoomId(), game);
            } else {
                System.out.println("명령어 : " + message.getTargets());
                Game game = gameService.playGame(message.getRoomId(), message.getMessage(), message.getTargets());
                sendingOperations.convertAndSend("/topic/game/room/"+message.getRoomId(), game);
            }
        }


    }

    @Scheduled(fixedRate = 1000)
    public void sendServerTime() {
        List<Game> allRoom = gameService.findAllRoom();
        for (int i = 0; i < allRoom.size(); i++) {
            if (allRoom.get(i).isStarted()) {
                sendingOperations.convertAndSend("/topic/game/room/" + allRoom.get(i).getGameId(), allRoom.get(i).getTime());
                System.out.println(allRoom.get(i).getGameName() + "에 " + allRoom.get(i).getTime() + "초 라고 보냈음");
            }
        }
    }

}

