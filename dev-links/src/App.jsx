import "./App.css";
import avatarDark from "./assets/avatar-color-dark.png";
import avatarLight from "./assets/avatar-color-light.png";
import linksInfo from "../linkInfo.json";

import { useEffect, useState } from "react";

import { Profile } from "./components/Profile/Profile";
import { ToggleMode } from "./components/ToggleMode/ToggleMode";
import { LinkItem } from "./components/LinkItem/LinkItem";

function App() {
  const [mode, setMode] = useState("dark");
  const [avatar, setAvatar] = useState(avatarDark);
  const [linksList, setLinksList] = useState(linksInfo.links);

  useEffect(() => {
    setLinksList(linksInfo.links);
  }, []);

  function toggleMode() {
    if (mode === "dark") {
      setMode("light");
      setAvatar(avatarLight);
    } else {
      setMode("dark");
      setAvatar(avatarDark);
    }
  }

  return (
    <div className={`container ${mode}`}>
      <div className="devlinks">
        <Profile image={avatar} mode={mode} />
        <ToggleMode toggleMode={toggleMode} mode={mode} />

        <ul className="link-list">
          {linksList.map((link) => (
            <LinkItem
              key={link.id}
              title={link.title}
              url={link.url}
              img={link.img}
              mode={mode}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
