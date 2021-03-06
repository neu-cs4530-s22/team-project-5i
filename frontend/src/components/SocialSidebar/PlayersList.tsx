import React, { useState } from 'react';
import {Button, Checkbox, Heading, ListItem, OrderedList, Tooltip } from '@chakra-ui/react';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import Player from '../../classes/Player';
import PlayerName from './PlayerName';
import useChatContext from '../VideoCall/VideoFrontend/hooks/useChatContext/useChatContext';
import TextConversation from '../../classes/TextConversation';


/**
 * Lists the current players in the town, along with the current town's name and ID
 * 
 * Town name is shown in an H2 heading with a ToolTip that shows the label `Town ID: ${theCurrentTownID}`
 * 
 * Players are listed in an OrderedList below that heading, sorted alphabetically by userName (using a numeric sort with base precision)
 * 
 * Each player is rendered in a list item, rendered as a <PlayerName> component
 * 
 * See `usePlayersInTown` and `useCoveyAppState` hooks to find the relevant state.
 * 
 */
export default function PlayersInTownList(): JSX.Element {
  const toCreateConveresationBtn = document.getElementById('createConveresationBtn');
  const muteBtn = document.getElementById('muteBtn');
  const players = usePlayersInTown();
  const {currentTownID, currentTownFriendlyName, socket, userName} = useCoveyAppState();
  const currentPlayerName = userName;
  const [currentMutedPlayers, setCurrentMutedPlayers] = useState<string[]>([]); // Array form to allow for multiple conversations
  const sortPlayer = (player1: Player, player2: Player) => 
  player1.userName.localeCompare(player2.userName, 'en', { numeric: true })

  
  // The ids of players who have been selected from the list
  const [recipientNames, setrecipientNames] = useState<Array<string>>([userName]);

  // If one or more players have been selected
  // Show option to "create conversation" button
  if(toCreateConveresationBtn !== null && muteBtn !== null && recipientNames.length > 1){
    toCreateConveresationBtn.style.visibility = 'visible';
    muteBtn.style.visibility = 'visible';
  }

  // If no players have been selected
  // Hide option to "create conversation" button
  if(toCreateConveresationBtn !== null && muteBtn !== null && recipientNames.length < 2){
    toCreateConveresationBtn.style.visibility = 'hidden';
    muteBtn.style.visibility = 'hidden';
  }
  // This function will be triggered when a checkbox changes its state
  const selectRecipient = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedRecipient = event.target.value;
  
    // Check if "recipientNames" contains "selectedRecipient"
    // If true, this checkbox is already checked
    // Otherwise, it is not selected yet
    if (recipientNames.includes(selectedRecipient)) {
      const newRecipientNames = recipientNames.filter((id) => id !== selectedRecipient);
      setrecipientNames(newRecipientNames);
      console.log('Recipient name: ', recipientNames)
    } else {
      const newRecipientNames = [...recipientNames];
      newRecipientNames.push(selectedRecipient);
      setrecipientNames(newRecipientNames);
      console.log('Recipient name: ', recipientNames)
    }
  };

  const { isChatWindowOpen, setIsChatWindowOpen, conversation } = useChatContext();

  const toggleChatWindow = () => {
    setIsChatWindowOpen([!isChatWindowOpen[0], false]);
    
    if (socket) {
      if (conversation) {
        const names:string[][] | null = [[]];
        for (let i = 0; i < conversation?.length; i += 1) { // Builds the list of all convo names
          const newNames = conversation[i].occupants()?.sort();
          if (conversation[i] && newNames) {
            names.push(newNames);
          }
        }
        const newNames = recipientNames.sort();
        let dup = false;
        if(newNames) {
          let s1 = '';
          for (let k = 0; k < newNames?.length; k += 1) {
            s1 += newNames[k];
          }
          
          for (let j = 0; j < names?.length; j += 1) {
            let s2 = '';
            for (let k = 0; k < names[j].length; k += 1) {
              s2 += names[j][k];
            }
  
            if (s1 === s2) {
              dup = true;
            }
          }
        }
        if (!dup) {
          // console.log('Pushed a new convo with %s', recipientNames[0])
          conversation?.push(new TextConversation(socket, userName, recipientNames));
        }
      }
    }
   
    // Create direct message
    if(recipientNames.length === 2) {
      isChatWindowOpen.forEach(win => !win)
    }

    // Create group message
    if(recipientNames.length > 2){
      isChatWindowOpen.forEach(win => !win)
    }
  };

  const muteToggled = () => {
  
    const newRecipientNames = recipientNames.filter(name => name !== userName);

    const currentPlayer = players.find(p => p.userName === currentPlayerName);
    
    if (!currentPlayer) {
      return;
    }
  
    for(let i = 0; i < recipientNames.length; i += 1) {
      if (recipientNames[i] !== currentPlayer.userName) {
        
        if (currentPlayer.mutedPlayersByName.includes(recipientNames[i])) {
          currentPlayer.mutedPlayersByName = currentPlayer.mutedPlayersByName.filter(ele => ele !== recipientNames[i]);
          setCurrentMutedPlayers(currentPlayer.mutedPlayersByName);
          console.log('Removed player - Current muted list: ', currentPlayer.mutedPlayersByName);
        }
        else {
          const newMutedNames = [...newRecipientNames];
          currentPlayer.mutedPlayersByName.push(recipientNames[i]);
          setCurrentMutedPlayers(newMutedNames);
          console.log('Added player - Current muted list: ', currentPlayer.mutedPlayersByName);
        }
      }
    }
  }

  return (
  <>
  <Tooltip label={`Town ID: ${currentTownID}`}>
    <Heading fontSize='15px' as='h2'>
      Current town: {currentTownFriendlyName}
      <br />
      Current user: {currentPlayerName}
      <br />
      Muted users: {currentMutedPlayers}
      </Heading>
    </Tooltip>
    <br />
    <OrderedList>
      {[...players].filter(player => player.userName !== currentPlayerName).sort(sortPlayer).map((player) => 
      <ListItem key={player.userName}>
        <Checkbox 
          id='playerCheckbox'
          value={player.userName}
          onChange={selectRecipient}
          checked={recipientNames.includes(player.userName)}
          ><PlayerName player={player}/>
        </Checkbox>
      </ListItem>
        )}
    </OrderedList>
    <Button 
        id='createConveresationBtn' 
        onClick={toggleChatWindow}
        visibility='hidden'
        marginTop='15px'
        >Create Conversation
    </Button>
    <Button 
        id='muteBtn' 
        onClick={muteToggled}
        visibility='hidden'
        marginTop='15px'
        >Toggle Mute on Selected
    </Button>
  </>
        )
      }


