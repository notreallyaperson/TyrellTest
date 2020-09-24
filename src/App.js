import React, { useState } from 'react';
import './App.css';

// Just some reacstrap so it doesn't look like crap ;)
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, FormGroup, Input, Label, Alert, Button, Table } from 'reactstrap'

/* A few thoughts on your questions, you don't actually specify how we distribute the cards. 
  Theoratically I could randomly select a person and randomly assign a card.
  Or I could Make sure I cycle through each person and provide them a random card untill I run out
*/

const generateDeck = () => {
  var deck = []
  const suit = ["S", "H", "D", "C"]
  var card
  for (var i = 1; i < 14; i++) {
    switch (i) {
      case 1:
        card = 'A'
        break
      case 10:
        card = 'X'
        break
      case 11:
        card = 'J'
        break
      case 12:
        card = 'Q'
        break
      case 13:
        card = 'K'
        break
      default: card = i
    }
    suit.forEach(e => deck.push(`${e}-${card}`))
  }
  return deck
}


const App = props => {
  const cardSymbols = require('./images/cardSymbols.png')
  const [n, setN] = useState('')
  const [distributionStyle, setDistributionStyle] = useState('')
  const [results, setResults] = useState({})

  // Error Message handling for users
  const [errorMessage, setErrorMessage] = useState('')

  const checkValidInput = e => {
    setErrorMessage('')
    const inputNumber = Number(e.target.value)
    if (inputNumber < 0 || !Number.isInteger(inputNumber)) {
      return setErrorMessage('Requires A whole Number Greater than 0...')
    }
    setN(e.target.value)
  }

  const distributeCards = e => {
    e.preventDefault()
    // Create the deck
    var deck = generateDeck()

    if (distributionStyle === 'r') {
      // Setting range for random selection of person
      const min = Math.ceil(1);
      const max = Math.floor(n);

      var resultObject = {}
      var person
      deck.forEach(card => {
        // Randomly Select a person from the n people
        person = Math.floor(Math.random() * (max - min + 1)) + min
        resultObject[person] = resultObject[person] ? resultObject[person] + ',' + card : card
      })
    }

    if (distributionStyle === 'c') {
      resultObject = {}

      // Shuffle the deck
      for (let i = deck.length - 1; i > 0; i--) {
        // Get a random value for the deck to swap positions with
        const j = Math.floor(Math.random() * (i + 1));
        //Swap the positions
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      // We limit n to 52 in this case cause if they go more than 52, everyone gets one card
      for (var i = 0; i < n && i < 52; i++) {
        resultObject[i + 1] = ''
      }
      // Deal to the first person
      var counter = 1
      for (var i = 0; i < deck.length; i++) {
        resultObject[counter] = resultObject[counter] ? resultObject[counter] + ',' + deck[i] : deck[i]
        // Move to the next person
        counter = counter + 1
        // Return to the first person after we have gone through everyone
        if (counter > n) { counter = 1 }
      }
    }

    setResults(resultObject)
  }

  const resetAll = () => {
    setDistributionStyle('')
    setN('')
    setResults({})
  }

  return (
    <div className="App">
      <Container>
        <br />
        {errorMessage ?
          <Alert color='danger'>{errorMessage}</Alert>
          : <div // This is just to keep the spacing consistant when the alert is not displayed
            style={{
              height: '50px',
              display: 'block',
              marginBottom: '1rem',

            }}
          />}
        <Form onSubmit={e => distributeCards(e)}>
          <FormGroup>
            <Label>Number of People</Label>
            <Input
              type='number'
              placeholder="Whole Number Greater than 0"
              value={n}
              onChange={e => checkValidInput(e)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Distribution Style</Label>
            <Input
              type='select'
              value={distributionStyle}
              onChange={e => setDistributionStyle(e.target.value)}
              required
            >
              <option value=''>Select Distribution Style</option>
              <option value='r'>Randomly Select People</option>
              <option value='c'>Cycle Through All People if possible</option>
            </Input>
          </FormGroup>
          <Button color='primary' type='submit'>
            Deal
            <img
              style={{
                marginLeft: '5px',
                width: '50px'
              }}
              src={cardSymbols} />
          </Button> {' '}
          <Button
            color='danger'
            onClick={() => resetAll()}
          >
            Reset
          </Button>
        </Form>

        {/* Theoratically would have broken into 2 functional components but keeping it in one page for this test */}
        <br />
        <h3>Results</h3>
        <Table>
          <thead>
            <tr>
              <th style={{width: '50%'}}>Person</th>
              <th style={{width: '50%'}}>Cards</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(results).map(e => {
              return (
                <tr key={e}>
                  <td>{e}</td>
                  <td>{results[e]}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}

export default App;
