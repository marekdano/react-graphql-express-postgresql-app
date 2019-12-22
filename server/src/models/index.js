let users = {
  1: {
    id: '1',
    username: 'Marek Dano',
    noteIds: [1, 2],
  },
  2: {
    id: '2',
    username: 'Laura Danova',
    noteIds: [3],
  },
}

let notes = {
  1: {
    id: '1',
    text: 'Hello',
    userId: '1',
  },
  2: {
    id: '2',
    text: 'Cau',
    userId: '1',
  },
  3: {
    id: '3',
    text: 'Ahoy',
    userId: '2',
  },
}

export default {
  users,
  notes,
}
