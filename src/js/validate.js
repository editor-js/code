'use strict';

/**
 * Check output data for validity.
 * Should be defined by developer
 *
 * @param data
 */

module.exports = (data) => {
  let text = data.text.trim() === '';

  if (text) {
    return false;
  }

  return true;
};
