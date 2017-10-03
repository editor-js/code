'use strict';

/**
 * Header Plugin
 */

module.exports = function () {
  /**
   * Load module package info
   */
  let {exportModuleName, version} = require('../package');

  /**
   * Create variable for tag element
   */
  let element;

  /**
   * Wrapper for render function
   *
   * @param {object} data      — plugin json data to be converted HTML element
   * @return {object} element  — DOM element
   */
  let render = function render(data) {
    let render_ = require('./js/render');

    element = render_(data);
    return element;
  };

  /**
   * Wrapper for validate function
   */
  let validate = function validate() {
    let validate_ = require('./js/validate');

    return validate_;
  };

  /**
   * Wrapper for save function
   *
   * @return {object} element — block
   */
  let save = function save() {
    let save_ = require('./js/save'),
        jsonData = save_(element);

    return jsonData;
  };

  /**
   * Return object with public functions
   */
  return {
    name: exportModuleName,
    version: version,
    render: render,
    validate: validate,
    save: save
  };
};
