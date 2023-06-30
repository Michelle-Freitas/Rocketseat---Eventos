import "./style.css";

export function LinkItem({ title, url, img, mode }) {
  return (
    <li>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`link-item ${mode}`}
      >
        <img src={img} alt={`logo da rede social ${title}`} />
        {title}
      </a>
    </li>
  );
}
