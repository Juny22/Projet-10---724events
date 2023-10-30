import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const byDateDesc = data?.focus?.slice().sort((evtA, evtB) =>
    new Date(evtA.date) > new Date(evtB.date) ? -1 : 1
  ) || [];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0));
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [byDateDesc.length]);

  const handleRadioChange = (radioIdx) => {
  // Changer l'index en fonction de la sélection de l'utilisateur
  setIndex(radioIdx);
};

return (
  <div className="SlideCardList">
    {byDateDesc?.map((event, idx) => (
      <div key={`slide_${event.title}`} className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}>
        <img src={event.cover} alt="forum" />
        <div className="SlideCard__descriptionContainer">
          <div className="SlideCard__description">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <div>{getMonth(new Date(event.date))}</div>
          </div>
        </div>
      </div>
    ))}
    <div className="SlideCard__paginationContainer">
      <div className="SlideCard__pagination">
        {byDateDesc.map((event, idx) => (
          <input
            key={`page_${event.title}`}
            type="radio"
            name={`radio-button-${idx}`}
            checked={index === idx}
            onChange={() => handleRadioChange(idx)}
          />
        ))}
      </div>
    </div>
  </div>
);
};

export default Slider;
