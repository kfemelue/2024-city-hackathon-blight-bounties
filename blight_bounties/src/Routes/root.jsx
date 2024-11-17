import Header from "../Components/Header.js";
import Bounties from "../Components/Bounties.js";
import ChatWindow from "../Components/ChatWindow.jsx";
import { Link } from 'react-router-dom';

export default function Root() {
    return (
      <>
      <Header /> 

      <h2>Bounties</h2>
      <ChatWindow />
      </>
    );
  }
  