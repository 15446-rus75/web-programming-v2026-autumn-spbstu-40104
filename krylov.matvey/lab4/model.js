export class Event {
  constructor(id, title, participants, date) {
    this.id = id;
    this.title = title;
    this.participants = participants;
    this.date = date;
  }

  addParticipant(name) {
    this.participants.push(name);
  }

  removeParticipant(name) {
    const index = this.participants.indexOf(name)
    if (index >= 0) {
      this.participants.splice(index, 1);
    }
  }

  get participantCount() {
    return this.participants.length;
  }
};

export function groupEventsByDate(events) {
  const groupedEvents = new Map();
  for (let i = 0; i < events.length; i++) {
    if (!groupedEvents.has(events[i].date)) {
      groupedEvents.set(events[i].date, []);
    }
    groupedEvents.get(events[i].date).push(events[i]);
  }
  return groupedEvents;
}

export function groupEventsByParticipantCount(events) {
  const groupedEvents = new Map();
  for (let i = 0; i < events.length; i++) {
    if (!groupedEvents.has(events[i].participants.length)) {
      groupedEvents.set(events[i].participants.length, []);
    }
    groupedEvents.get(events[i].participants.length).push(events[i]);
  }
  return groupedEvents;
}

export function getUniqueParticipants(events) {
  const uniqueParticipants = new Set();
  for (let i = 0; i < events.length; i++) {
    let eventParticipants = events[i].participants;
    for (let j = 0; j < eventParticipants.length; j++) {
      uniqueParticipants.add(eventParticipants[j]);
    }
  }
  return uniqueParticipants;
}

export function findEventsByParticipant(events, name) {
  const foundEvents = [];
  for (let i = 0; i < events.length; i++) {
    if (events[i].participants.includes(name)) {
      foundEvents.push(events[i]);
    }
  }
  return foundEvents;
}

export function findEventsByMonth(events, month) {
  const foundEvents = [];
  for (let i = 0; i < events.length; i++) {
    if (new Date(events[i].date).getMonth() + 1 === Number(month)) {
      foundEvents.push(events[i]);
    }
  }
  return foundEvents;
}