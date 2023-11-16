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
      return true;
    }
    return false;
  }).slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  let calculatedPageNumber = 0;

if (filteredEvents) {
  calculatedPageNumber = Math.ceil(filteredEvents.length / PER_PAGE);
}

let pageNumber = calculatedPageNumber; // Utilisez une nouvelle variable pour stocker le nombre de pages

// Si le filtre "tous" est activé, ajustez le nombre de pages
if (!type && calculatedPageNumber > 0) {
  const totalEvents = data.events.length;
  const allPages = Math.ceil(totalEvents / PER_PAGE);
  // Utilisez un minimum de 1 page, même si aucun événement est trouvé
  pageNumber = Math.max(allPages, 1);
}

  // Obtenez la liste des catégories uniques à partir des événements
  const typeList = [...new Set(data?.events.map((event) => event.type))];

  return (
    <>
      {error && <div>An error occurred</div>}
      {data === null ? (
        !error && 
        "Loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={typeList}
            onChange={(newValue) => changeType(newValue)}
          />
          <div id="events" className="ListContainer">
            {filteredEvents && filteredEvents.length > 0 && filteredEvents.map((event) => (
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
