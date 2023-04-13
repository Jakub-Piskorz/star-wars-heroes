import './Card.scss';
import { Link } from 'react-router-dom';

interface Props {
  name: string;
  text: string;
  url?: string;
}

const CardData = ({ name, text, url }: Props) => (
  <div className="card">
    <div className="card__name">{name}</div>
    <div className="card__homeworld">{text}</div>
  </div>
);

const Card = (props: Props) => {
  if (!props.url) {
    return <CardData {...props} />;
  } else {
    return (
      <Link to={`${props.url}`}>
        <CardData {...props} />
      </Link>
    );
  }
};

export default Card;
