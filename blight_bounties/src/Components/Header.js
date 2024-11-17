import mem311_top from "../Assets/mem311_top.png";
import "./Header.css";

function Header() {
  return(
  <header className="App-header">
    <a href="../App.js"><img id="headerLogo" src={mem311_top} alt="mem311"></img></a>
    <div id="navBar">
        <a href="#"><p>Link</p></a>
        <a href="#"><p>Link</p></a>
    </div>
  </header>
  );
}

export default Header