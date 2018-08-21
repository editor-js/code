/**
 * Build styles
 */
require('./index.css').toString();

/**
 * CodeTool for CodeX Editor
 *
 * @author CodeX (team@ifmo.su)
 * @copyright CodeX 2018
 * @license The MIT License (MIT)
 * @version 2.0.0
 */

class CodeTool {
  /**
   * Should this tool be displayed at the Editor's Toolbox
   * @returns {boolean}
   * @public
   */
  static get displayInToolbox() {
    return true;
  }

  /**
   * Allow to press Enter inside the CodeTool textarea
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * @typedef {Object} CodeData — plugin saved data
   * @param {String} code - previously saved plugin code
   */

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {CodeData} data — previously saved plugin code
   * @param {Object} config - user config for Tool
   * @param {Object} api - CodeX Editor API
   */
  constructor({data, config, api}) {
    this.api = api;

    this.placeholder = config.placeholder || Code.DEFAULT_PLACEHOLDER;

    this.CSS = {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,
      wrapper: 'ce-code',
      textarea: 'ce-code__textarea'
    };

    this.data = {
      code: data.code || ''
    };

    this.element = this.drawView();
  }

  /**
   * Create Tool's view
   * @return {HTMLElement}
   * @private
   */
  drawView() {
    let wrapper = document.createElement('div'),
      textarea = document.createElement('textarea');

    wrapper.classList.add(this.CSS.baseClass, this.CSS.wrapper);
    textarea.classList.add(this.CSS.textarea, this.CSS.input);
    textarea.textContent = this.data.code;

    textarea.placeholder = this.placeholder;

    wrapper.appendChild(textarea);

    return wrapper;
  }

  /**
   * Return Tool's view
   * @returns {HTMLDivElement} this.element - Code's wrapper
   * @public
   */
  render() {
    return this.element;
  }

  /**
   * Extract Tool's data from the view
   * @param {HTMLDivElement} codeWrapper - CodeTool's wrapper, containing textarea with code
   * @returns {CodeData} - saved plugin code
   * @public
   */
  save(codeWrapper) {
    return {
      code: codeWrapper.querySelector('textarea').value
    };
  }

  /**
   * Get Tool icon's SVG
   * @return {string}
   */
  static get toolboxIcon() {
    return `<svg width="14" height="14"><path d="M2.886 6.879c.187.254.316.574.388.958.071.374.106.847.106 1.422 0 .42.01.729.028.924.018.182.051.315.097.398.041.075.084.117.128.134.067.027.197.056.38.084a.758.758 0 0 1 .51.298c.13.167.195.382.195.638 0 .615-.393.938-1.105.938a2.35 2.35 0 0 1-1.12-.263 1.885 1.885 0 0 1-.775-.754 2.266 2.266 0 0 1-.277-1.101c-.013-.651-.026-1.173-.039-1.567-.013-.384-.031-.633-.054-.736-.06-.263-.144-.456-.251-.58a1.995 1.995 0 0 0-.459-.377 2.036 2.036 0 0 1-.471-.373C.052 6.788 0 6.592 0 6.34c0-.371.151-.66.448-.85.299-.186.51-.343.63-.467a.97.97 0 0 0 .236-.45c.05-.2.08-.42.088-.66.009-.25.021-.853.039-1.808.013-.632.217-1.145.61-1.53C2.445.193 2.97 0 3.613 0c.712 0 1.105.318 1.105.925 0 .265-.063.482-.192.645a.758.758 0 0 1-.512.29c-.226.032-.378.077-.451.128-.057.04-.103.134-.127.292-.028.188-.047.564-.056 1.123a9.774 9.774 0 0 1-.102 1.384 2.379 2.379 0 0 1-.366.967c-.145.213-.34.407-.582.585.227.164.412.344.556.54zm7.212-.888a2.11 2.11 0 0 1-.39-.626c-.1-.241-.17-.524-.21-.848-.04-.318-.06-.69-.06-1.116 0-.404-.008-.712-.025-.923-.015-.197-.046-.336-.085-.412a.253.253 0 0 0-.133-.128 1.655 1.655 0 0 0-.384-.077.773.773 0 0 1-.503-.288c-.135-.164-.2-.382-.2-.648C8.107.319 8.495 0 9.198 0c.424 0 .8.086 1.127.26.328.175.588.425.776.748.188.323.284.69.289 1.097.025 1.396.056 2.19.085 2.313.063.259.153.451.266.577.122.136.27.257.446.362.203.122.357.246.462.373.12.144.175.349.175.61 0 .375-.15.663-.443.843-.29.178-.497.333-.621.46a.983.983 0 0 0-.243.45c-.05.194-.081.495-.092.9-.01.416-.022.936-.035 1.562-.014.632-.22 1.147-.617 1.535-.398.389-.926.583-1.575.583-.334 0-.6-.077-.793-.236-.2-.165-.299-.404-.299-.702 0-.163.03-.314.09-.453a.835.835 0 0 1 .252-.336.73.73 0 0 1 .363-.147 1.74 1.74 0 0 0 .391-.086.248.248 0 0 0 .131-.138 1.29 1.29 0 0 0 .082-.417c.015-.204.022-.504.022-.901.01-.6.044-1.07.106-1.415a2.31 2.31 0 0 1 .367-.925 2.47 2.47 0 0 1 .585-.577 2.644 2.644 0 0 1-.398-.35z"/></svg>`
  }

  /**
   * Default placeholder for CodeTool's textarea
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_PLACEHOLDER() {
    return 'Enter code';
  }

}

module.exports = CodeTool;