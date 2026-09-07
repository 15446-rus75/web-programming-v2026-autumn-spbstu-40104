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
