import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';

import useChatContext from '../../../hooks/useChatContext/useChatContext';
import { Button, List, ListItem, OrderedList } from '@chakra-ui/react';
import DirectChatWindow from '../DirectChatWindow';
import RoomNameScreen from '../../PreJoinScreens/RoomNameScreen/RoomNameScreen';
import ChatWindow from '../ChatWindow';
import CloseIcon from '../../../icons/CloseIcon';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      height: '56px',
      background: '#F4F4F6',
      borderBottom: '1px solid #E4E7E9',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 1em',
    },
    text: {
      fontWeight: 'bold',
    },
    closeChatWindow: {
      cursor: 'pointer',
      display: 'flex',
      background: 'transparent',
      border: '0',
      padding: '0.4em',
    },
  })
);

function toString(recipients:string[]) {
  let convoName = "";
  for (let i = 0; i < recipients.length; i++) {
    convoName = convoName + recipients[i]
    if (i !== recipients.length-1) {
      convoName = convoName + ",";
    }
  }
  return convoName;
}

export default function ChatWindowHeader() {
  const classes = useStyles();
  const { setIsChatWindowOpen } = useChatContext();
  let { isChatWindowOpen, messages, conversation } = useChatContext();

  function openConvo(conversation :string[]) {
    return <div>
      {setIsChatWindowOpen([false, true])}
      <DirectChatWindow occupants={conversation}/>
    </div>;
  }

  let names = [['test1','test2'],
               ['test2','test3'],
               ['test3','test4','test5','test6'],
               ['test4','test5']];

  return (
    <div className={classes.container}>
      <div className={classes.text}>Group Message
      </div>
    </div>
  );
}
