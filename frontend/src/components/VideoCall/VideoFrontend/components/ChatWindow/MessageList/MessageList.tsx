import React from 'react';
import { ChatMessage } from '../../../../../../classes/TextConversation';
import MessageInfo from './MessageInfo/MessageInfo';
import MessageListScrollContainer from './MessageListScrollContainer/MessageListScrollContainer';
import TextMessage from './TextMessage/TextMessage';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import usePlayersInTown from '../../../../../../hooks/usePlayersInTown';
import useCoveyAppState from '../../../../../../hooks/useCoveyAppState';

interface MessageListProps {
  messages: ChatMessage[];
}

const getFormattedTime = (message?: ChatMessage) =>
  message?.dateCreated.toLocaleTimeString('en-us', { hour: 'numeric', minute: 'numeric' }).toLowerCase();

export default function MessageList({ messages }: MessageListProps) {
  const { room } = useVideoContext();
  const localParticipant = room!.localParticipant;

  const players = usePlayersInTown();
  const { userName } = useCoveyAppState();
  const currentPlayer = players.find(p => p.userName === userName);

  const newMessages = []
  for (let i = 0; i < messages.length; i++) {
    if (!currentPlayer?.mutedPlayersByName.includes(messages[i].author)) {
      newMessages.push(messages[i]);
    }
  }
  messages = newMessages;

  return (
    <MessageListScrollContainer messages={messages}>
      {messages.map((message, idx) => {
        if(!message.direct) {
          const time = getFormattedTime(message)!;
          const previousTime = getFormattedTime(messages[idx - 1]);

          // Display the MessageInfo component when the author or formatted timestamp differs from the previous message
          const shouldDisplayMessageInfo = time !== previousTime || message.author !== messages[idx - 1]?.author;

          const isLocalParticipant = localParticipant.identity === message.author;

          const profile = players.find(p => p.id == message.author);

          return (
            <React.Fragment key={message.sid}>
              {shouldDisplayMessageInfo && (
                <MessageInfo author={profile?.userName || message.author} isLocalParticipant={isLocalParticipant} dateCreated={time} />
              )}
              <TextMessage body={message.body} isLocalParticipant={isLocalParticipant} />
            </React.Fragment>
          );
        }
      })}
    </MessageListScrollContainer>
  );
}
