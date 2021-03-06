import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ChatWindowHeader from './ChatWindowHeader/ChatWindowHeader';
import DirectChatWindowHeader  from './ChatWindowHeader/DirectChatWindowHeader';
import GroupChatWindowHeader  from './ChatWindowHeader/GroupChatWindowHeader';
import ChatInput from './ChatInput/ChatInput';
import clsx from 'clsx';
import MessageList from './MessageList/MessageList';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import DirectMessageList from './MessageList/DirectMessageList';
import GroupMessageList from './MessageList/GroupMessageList';
import DirectChatInput from './ChatInput/DirectChatInput';
import GroupChatInput from './ChatInput/GroupChatInput';
import DirectChatWindow from './DirectChatWindow';
import GroupChatWindowConversations from './ChatWindowHeader/GroupChatWindowConversations';
import DirectChatWindowConversations from './ChatWindowHeader/DirectChatWindowConversations';
import ChatWindowHeaderWithClose from './ChatWindowHeader/ChatWindowHeaderWithClose';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    chatWindowContainer: {
      width: '320px',
      background: '#FFFFFF',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      borderLeft: '1px solid #E4E7E9',
      [theme.breakpoints.down('sm')]: {
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 100,
      },
      position: 'fixed',
      bottom: 0,
      left: 0,
      top: 0,
      'max-width': '320px'
    },
    closeChatWindow: {
      cursor: 'pointer',
      display: 'flex',
      background: 'transparent',
      border: '0',
      padding: '0.4em',
    },
    hide: {
      display: 'none',
    }
  })
);

// In this component, we are toggling the visibility of the ChatWindow with CSS instead of
// conditionally rendering the component in the DOM. This is done so that the ChatWindow is
// not unmounted while a file upload is in progress.

export default function ChatWindow() {
  const classes = useStyles();
  const { isChatWindowOpen, messages, conversation, currConversation } = useChatContext();
  const { setIsChatWindowOpen } = useChatContext();

  if (conversation) {
    const currOccupants = conversation[currConversation].occupants();
    if (isChatWindowOpen[0]) { //Conversation Viewer
      return (
        <aside className={clsx(classes.chatWindowContainer, { [classes.hide]: !isChatWindowOpen[0] })}>
          <ChatWindowHeader />
          <MessageList messages={messages} />
          <ChatInput conversation={conversation[0]!} isChatWindowOpen={isChatWindowOpen[0]} />

          <DirectChatWindowHeader />
          <DirectChatWindowConversations />
          
          <GroupChatWindowHeader />
          <GroupChatWindowConversations />
          <br />
        </aside>
      );
    } else if(isChatWindowOpen[1] && currOccupants) { //Group Window
      return (
        <aside className={clsx(classes.chatWindowContainer, { [classes.hide]: !isChatWindowOpen[1] })}>
        <ChatWindowHeaderWithClose occupants={currOccupants}/>
        <GroupMessageList messages={messages} conversation={conversation[currConversation]} />
        <GroupChatInput conversation={conversation[currConversation]!} isChatWindowOpen={isChatWindowOpen[1]} 
        recipients={currOccupants}/>
        <br />
      </aside>
      );
    } else if(isChatWindowOpen[2] && currOccupants) { //Direct Window
      return (
        <aside className={clsx(classes.chatWindowContainer, { [classes.hide]: !isChatWindowOpen[2] })}>
        <ChatWindowHeaderWithClose occupants={currOccupants}/>
        <DirectMessageList messages={messages} conversation={conversation[currConversation]}/>
        <DirectChatInput conversation={conversation[currConversation]!} isChatWindowOpen={isChatWindowOpen[2]} 
          recipient={currOccupants} />
        <br />
      </aside>
      );
    }
  }
  return (
    <aside className={clsx(classes.chatWindowContainer, { [classes.hide]: !isChatWindowOpen[0] })}>
      <ChatWindowHeader />
      <MessageList messages={messages} />
      <br />
    </aside>
  );
}
