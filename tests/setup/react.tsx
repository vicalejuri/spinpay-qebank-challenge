/**
 * Render a React Component, by simulating a browser DOM api
 * in a test environment.
 */
import { JSDOM } from 'jsdom';
import React from 'react';

import { render as reactRender } from 'react-dom';
import { act } from 'react-dom/test-utils';

const { window } = new JSDOM('<!doctype html><html><body><main/></body></html>');

export function setup(context) {
  // @ts-ignore
  global.window = window;
  global.document = window.document;
  global.navigator = window.navigator || {
    userAgent: 'node.js'
  };
  global.getComputedStyle = window.getComputedStyle;
  global.requestAnimationFrame = function (callback) {
    return setTimeout(callback, 0);
  };
  global.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };
}

export function reset() {
  window.document.title = '';
  window.document.head.innerHTML = '';
  window.document.body.innerHTML = '<main></main>';
}

/**
 * @typedef RenderOutput
 * @property container {HTMLElement}
 * @property component {React.ReactElement}
 */

/**
 * render a React component using `props`
 * @return {RenderOutput}
 */
export function render(Component: JSX.Element, props = {}) {
  const container = window.document.querySelector('main');
  reactRender(<React.StrictMode>{Component}</React.StrictMode>, container);
  return { container };
}

/**
 * Trigger a event.
 *
 * @param {HTMLElement} elem
 * @param {String} event
 * @param {any} [details]
 */
export async function fire(
  elem: { dispatchEvent: (arg0: Event) => void },
  event: string,
  details: EventInit | undefined
) {
  await act(() => {
    let evt = new window.Event(event, details);
    elem.dispatchEvent(evt);
  });
}
