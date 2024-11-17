import Header from "../Components/Header.js";
import Bounties from "../Components/Bounties.js";
import { Link } from 'react-router-dom';
import '../App.css';

export default function Root() {
    return (
      <>
        <div className="App">
      <Header /> 
      <h2>Bounties</h2>
        <ul>
          <li>
            <Link to={Bounties}>Bounties</Link>
          </li>
        </ul>
    </div>
      </>
    );
  }
  