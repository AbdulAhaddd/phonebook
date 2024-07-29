const http = require("http");
const express = require("express");
const app = express();
const morgan = require('morgan')
app.use(express.json());
const cors = require('cors')

app.use(cors())

morgan.token('body', (request) => {
    return JSON.stringify(request.body)
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456",
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345",
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
  },
];

const entries = persons.length;

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const date = new Date();
  const formattedDate = date.toString();
  const responseText = `
    <html>
        <body>
            <p>Phonebook has info for ${entries} people</p>
            <p>${formattedDate}</p>
        </body>
    </html>
    `;
  response.set('Content-Type', 'text/html');
  response.send(responseText);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map((n) => Number(n.id)))
    : 0;
  return String(maxId + 1);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }
  else if (persons.some(entry => entry.name === body.name)) {
    return response.status(400).json({
        error: "name must be unique",
      });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
    important: Boolean(body.important) || false
  };

  persons = persons.concat(person);
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


