import {Event} from './model.js';

let events = [
  new Event(12, 'Дрочильня', ['Илья', 'Юра', 'Влад'], '10.10.2006'),
];

const listContainer = document.querySelector('[data-testid="entity-list"]');
const addEventButton = document.querySelector('#add-event-button');
const windowFormParticipant = document.querySelector(
  '#window-form-participant',
);
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
  events = parsed.map(
    (item) =>
      new Event(item.id, item.title, item.participants || [], item.date),
  );
}

function render() {
  listContainer.innerHTML = '';

  if (events.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Нет мероприятий';
    listContainer.appendChild(empty);
    return;
  }

  events.forEach((event) => {
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
    spreadListButton.dataset.participantsCount = event.participantCount;
    card.appendChild(spreadListButton);

    const participantList = document.createElement('ul');
    participantList.className = 'participant-list hidden';

    if (event.participants.length === 0) {
      const emptyElement = document.createElement('li');
      emptyElement.textContent = 'Нет участников';
      participantList.appendChild(emptyElement);
    } else {
      event.participants.forEach((participant) => {
        const element = document.createElement('li');
        element.textContent = participant;

        const deleteParticipantButton = document.createElement('button');
        deleteParticipantButton.type = 'button';
        deleteParticipantButton.textContent = 'X';
        deleteParticipantButton.className = 'delete-participant-button';
        deleteParticipantButton.dataset.eventId = event.id;
        deleteParticipantButton.dataset.name = participant;
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

function openParticipantWindow(eventID) {
  formParticipant.reset();
  formParticipant.querySelector('[name="eventID"]').value = eventID;
  windowFormParticipant.classList.remove('hidden');
}

function closeParticipantWindow() {
  windowFormParticipant.classList.add('hidden');
}

function addEventOnSubmitHandler(e) {
  e.preventDefault();

  const id = Number(formEvent.querySelector('[name="id"]').value);
  const title = formEvent.querySelector('[name="title"]').value;
  const date = formEvent.querySelector('[name="date"]').value;

  const newEvent = new Event(id, title, [], date);

  asyncAddEvent(newEvent).then(() => {
    events.push(newEvent);
    saveToLocalStorage();
    render();
    closeEventWindow();
  });
}

function addParticipantOnSubmitHandler(e) {
  e.preventDefault();

  const name = formParticipant.querySelector('[name="participantName"]').value;
  const eventID = Number(
    formParticipant.querySelector('[name="eventID"]').value,
  );

  asyncAddParticipant(eventID, name).then(() => {
    const targetEvent = events.find((event) => event.id === eventID);
    targetEvent.addParticipant(name);
    saveToLocalStorage();
    closeParticipantWindow();
    render();
  });
}

function cardListClickHandler(e) {
  const deleteEventButton = e.target.closest('.delete-event-button');
  if (deleteEventButton) {
    const eventID = Number(deleteEventButton.dataset.eventId);

    asyncDeleteEvent(eventID).then(() => {
      events = events.filter((event) => event.id !== eventID);
      saveToLocalStorage();
      render();
    });
    return;
  }

  const addParticipantButton = e.target.closest('.add-participant-button');
  if (addParticipantButton) {
    openParticipantWindow(Number(addParticipantButton.dataset.eventId));
    return;
  }

  const spreadParticipantsButton = e.target.closest(
    '.spread-participant-list-button',
  );
  if (spreadParticipantsButton) {
    const card = spreadParticipantsButton.closest('.event-card');
    const ul = card.querySelector('.participant-list');
    ul.classList.toggle('hidden');
    const isHidden = ul.classList.contains('hidden');
    if (isHidden) {
      spreadParticipantsButton.textContent = `▸ Количество участников: ${spreadParticipantsButton.dataset.participantsCount}`;
    } else {
      spreadParticipantsButton.textContent = `▾ Количество участников: ${spreadParticipantsButton.dataset.participantsCount}`;
    }
    return;
  }

  const deleteParticipantButton = e.target.closest(
    '.delete-participant-button',
  );
  if (deleteParticipantButton) {
    const eventID = Number(deleteParticipantButton.dataset.eventId);
    const name = deleteParticipantButton.dataset.name;

    asyncDeleteParticipant(eventID, name).then(() => {
      const targetEvent = events.find((event) => event.id === eventID);
      targetEvent.removeParticipant(name);
      saveToLocalStorage();
      render();
    });
    return;
  }
}

formEvent.addEventListener('submit', addEventOnSubmitHandler);
formParticipant.addEventListener('submit', addParticipantOnSubmitHandler);

addEventButton.addEventListener('click', openEventWindow);
windowFormEvent
  .querySelector('.close-button-event-form')
  .addEventListener('click', closeEventWindow);

windowFormParticipant
  .querySelector('.close-button-participant-form')
  .addEventListener('click', closeParticipantWindow);

listContainer.addEventListener('click', cardListClickHandler);

function asyncAddEvent(newEvent) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(newEvent);
    }, 400);
  });
}

function asyncAddParticipant(eventID, newName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(eventID, newName);
    }, 400);
  });
}

function asyncDeleteEvent(eventID) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(eventID);
    }, 400);
  });
}

function asyncDeleteParticipant(eventID, name) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(eventID, name);
    }, 400);
  });
}

loadFromLocalStorage();
render();
