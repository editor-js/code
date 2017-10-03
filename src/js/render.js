'use strict';

/**
 * Method to render HTML block from JSON
 *
 * @param data
 */

module.exports = function (data) {
  const elementClass = 'code-plugin__input',
      placeholder = 'Enter сode';

  let element = document.createElement('TEXTAREA');

  if (data && data.text) {
    element.value = data.text;
  }

  element.classList.add(elementClass);
  element.setAttribute('data-placeholder', placeholder);

  return element;
};
