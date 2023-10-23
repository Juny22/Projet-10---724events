import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrer les événements en fonction de la catégorie sélectionnée
  const filteredEvents = data?.events.filter((event) => {
    if (!type || event.type === type) {
      console.log(`Événement inclus : ${event.title}, Type : ${event.type}`);
      return true;
    }
    console.log(`Événement exclu : ${event.title}, Type : ${event.type}`);
    return false;
  }).slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  // Calculez le nombre de pages nécessaires en fonction du nombre d'événements filtrés
  const pageNumber = filteredEvents ? Math.ceil(filteredEvents.length / PER_PAGE) : 0;
  
  // Obtenez la liste des catégories uniques à partir des événements
  const typeList = [...new Set(data?.events.map((event) => event.type))];

  return (
    <>
      {error && <div>An error occurred</div>}
      {data === null ? (
        "Loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={typeList}
            onChange={changeType}
          />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
          {Array.from({ length: pageNumber }).map((_, index) => {
          const page = index + 1;
          return (
              <a
                key={`page-${page}`} // Utilisation d'une clé unique basée sur le numéro de page
                href="#events"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </a>
            );
          })}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
