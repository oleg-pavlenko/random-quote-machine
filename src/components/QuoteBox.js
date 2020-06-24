import React, { useEffect } from 'react';
import Axios from 'axios';
import { useImmer } from 'use-immer';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab, faTwitter } from '@fortawesome/free-brands-svg-icons';

import 'bootstrap/dist/css/bootstrap.css';

library.add(fab, faTwitter);

function QuoteBox() {
  const QUOTES_API = 'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json';
  const icon = <FontAwesomeIcon icon={['fab', 'twitter-square']} size="2x" />;
  function getRandomRGB() {
    return `rgb(${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)})`;
  }
  const [state, updateState] = useImmer({
    randomIndex: 0,
    opacity: 1,
    quotesArr: [],
    text: '',
    randomColor: getRandomRGB(),
  });

  useEffect(() => {
    const myRequest = Axios.CancelToken.source();
    async function fetchData() {
      try {
        const result = await Axios.get(QUOTES_API, {}, { cancelToken: myRequest.token });
        updateState((draft) => {
          draft.quotesArr = result.data.quotes;
          draft.randomIndex = Math.floor(Math.random() * result.data.quotes.length);
        });
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
    return () => myRequest.cancel();
  }, [updateState]);

  useEffect(() => {
    if (state.quotesArr.length) {
      updateState((draft) => {
        draft.text = state.quotesArr[state.randomIndex].quote;
        draft.author = state.quotesArr[state.randomIndex].author;
        draft.randomColor = getRandomRGB();
      });
    }
  }, [state.quotesArr, state.randomIndex, updateState]);

  function handleClick() {
    let newRandomIndex = Math.floor(Math.random() * state.quotesArr.length);
    while (newRandomIndex === state.randomIndex) {
      newRandomIndex = Math.floor(Math.random() * state.quotesArr.length);
    }
    updateState((draft) => {
      draft.randomIndex = newRandomIndex;
    });
  }

  return (
    <main style={{ backgroundColor: state.randomColor, color: state.randomColor }}>
      <div id="quote-box" className="quote-box">
        <SwitchTransition>
          <CSSTransition
            key={state.text}
            classNames="fade"
            timeout={350}
          >
            <p id="text">
              {state.text}
              <span id="author">
                –
                {state.author}
              </span>
            </p>
          </CSSTransition>
        </SwitchTransition>
        <div className="footer">
          <a href={`https://twitter.com/intent/tweet?text=${state.text} ${state.author} ${'%23quotes'}`} style={{ color: state.randomColor }}>
            {icon}
          </a>
          <button className="btn btn-info" id="new-quote" onClick={handleClick} style={{ backgroundColor: state.randomColor }} type="button">New Quote</button>
        </div>
      </div>
    </main>
  );
}

export default QuoteBox;
