import { Event } from './model.js';

let events = [];

const listContainter = document.querySelector('[data-testid="entity-list"]');
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


