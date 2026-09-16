import { Event } from './model.js';

let events = [new Event(12, 'Дрочильня', ['Илья', 'Юра', 'Влад'], '10.10.2006')];

const listContainer = document.querySelector('[data-testid="entity-list"]');
const addEventButton = document.querySelector('#add-event-button');
const windowFormParticipant = document.querySelector('#window-form-participant');
const windowFormEvent = document.querySelector('#window-form-event');
const formEvent = document.querySelector('#event-form');
const formParticipant = document.querySelector('#participant-form');

function saveToLocalStorage() {
  localStorage.setItem('events', JSON.stringify(events));
}

function loadFromLocalStorage() {
  const rawEvents = localStorage.getItem('events');
  if (!rawEvents) {
    events = [];
    return;
  }
  const parsed = JSON.parse(rawEvents);
  events = parsed.map(item => new Event(
    item.id,
    item.title,
    item.participants || [],
    item.date
  ));
}

function render() {
  listContainer.innerHTML = '';

  if (events.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Нет мероприятий';
    listContainer.appendChild(empty);
    return;
  }

  events.forEach(event => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.dataset.testid = 'entity-card';
    card.dataset.id = event.id;

    const title = document.createElement('h3');
    title.textContent = event.title;
    card.appendChild(title);

    const date = document.createElement('p');
    date.textContent = `Дата: ${event.date}`;
    card.appendChild(date);

    const spreadListButton = document.createElement('button');
    spreadListButton.type = 'button';
    spreadListButton.className = 'spread-participant-list-button';
    spreadListButton.textContent = `▸ Количество участников: ${event.participantCount}`;
    card.appendChild(spreadListButton);

    const participantList = document.createElement('ul');
    participantList.className = 'participant-list hidden';

    if (event.participants.length === 0) {
      const emptyElement = document.createElement('li');
      emptyElement.textContent = 'Нет участников';
      participantList.appendChild(emptyElement);
    } else {
      event.participants.forEach(participant => {
        const element = document.createElement('li');
        element.textContent = participant;
        const deleteParticipantButton = document.createElement('button');
        deleteParticipantButton.type = 'button';
        deleteParticipantButton.textContent = 'X';
        deleteParticipantButton.className = 'delete-participant';
        element.appendChild(deleteParticipantButton);
        participantList.appendChild(element);
      });
    }
    card.appendChild(participantList);

    const deleteEventButton = document.createElement('button');
    deleteEventButton.type = 'button';
    deleteEventButton.className = 'delete-event-button';
    deleteEventButton.textContent = '🗑';
    deleteEventButton.dataset.eventId = event.id;
    deleteEventButton.dataset.testid = 'delete-entity';
    card.appendChild(deleteEventButton);

    const addParticipantButton = document.createElement('button');
    addParticipantButton.type = 'button';
    addParticipantButton.className = 'add-participant-button';
    addParticipantButton.textContent = '+ Участника';
    addParticipantButton.dataset.eventId = event.id;
    addParticipantButton.dataset.name = participant;
    card.appendChild(addParticipantButton);

    listContainer.appendChild(card);
  });
}


function openEventWindow() {
  windowFormEvent.classList.remove('hidden');
  formEvent.reset();
}

function closeEventWindow() {
  windowFormEvent.classList.add('hidden');
}

function openParticipantWindow() {
  windowFormParticipant.classList.remove('hidden');
  formParticipant.reset();
}

function closeParticipantWindow() {
  windowFormParticipant.classList.add('hidden');
}



addEventButton.addEventListener('click', openEventWindow);
document.querySelector('.close-button-event-form').addEventListener('click', closeEventWindow);
render();


