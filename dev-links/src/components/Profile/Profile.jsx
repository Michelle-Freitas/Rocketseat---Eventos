import "./style.css";

export function Profile({ image, mode }) {
  return (
    <div className="profile">
      <div className="image-border">
        <img className="profile-image" src={image} alt="Imagem de avatar" />
      </div>
      <p className={mode}>@michelle-freitas</p>
    </div>
  );
}
