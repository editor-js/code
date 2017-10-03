'use strict';

/**
 * Method to extract JSON data from HTML block
 *
 * @param element
 */

module.exports = function (element) {
  var escaped = escapeHTML_(element.value),
      data = {
        text: escaped
      };

  return data;
};

/**
 * Escapes HTML chars
 *
 * @param {string} input
 * @return {string} — escaped string
 */
var escapeHTML_ = function escapeHTML_(input) {
  var div = document.createElement('DIV'),
      text = document.createTextNode(input);

  div.appendChild(text);

  return div.innerHTML;
};