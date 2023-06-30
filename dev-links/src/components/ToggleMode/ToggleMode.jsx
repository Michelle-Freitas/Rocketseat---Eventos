import "./style.css";

export function ToggleMode({ mode, toggleMode }) {
  return (
    <div className={`switch ${mode}`}>
      <button onClick={toggleMode}></button>
      <span></span>
    </div>
  );
}
