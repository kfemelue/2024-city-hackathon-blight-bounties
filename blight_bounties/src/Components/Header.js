import mem311_top from "../Assets/mem311_top.png";
import "./Header.css";

function Header() {
  return(
  <header className="App-header" style={{position: 'sticky', top: 0, width: '100vw'}}>
    <a style={{float:"left"}} href="/"><img id="headerLogo" src={mem311_top} alt="mem311"></img></a>
    <h1>Blight Bounties</h1>
    <div id="navBar" style={{justifyContent:'space-between'}}>
        <a href="/Form">Report Blight</a>
        &emsp;&emsp;
        <a href="/Bounties">Remove Blight</a>
    </div>
  </header>
  );
}

export default Header