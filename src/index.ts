import './index.css';
import { getLineStartPosition } from './utils/string';
import { IconBrackets } from '@codexteam/icons';
import { API, BlockToolConstructorOptions, BlockTool, PasteEvent } from '@editorjs/editorjs';

/**
 * CodeTool for Editor.js
 *
 * @version 2.0.0
 * @license MIT
 */

/**
 * @description CodeTool generates data in this format
 */
export interface CodeData {
  code: string;
}

/**
 * @description CodeTool's config from User
 */
export interface CodeConfig {
  placeholder: string
}

interface CodeToolCSS {
  /** Block Styling from Editor.js API */
  baseClass: string;
  /** Input Styling from Editor.js API */
  input: string;
  /** Wrapper styling */
  wrapper: string;
  /** Textarea styling */
  textarea: string;
}

interface CodeToolNodes {
  /** Main container or Wrapper for CodeTool */
  holder: HTMLDivElement | null;
  /** Textarea where user inputs their code */
  textarea: HTMLTextAreaElement | null;
}

/**
 * Code Tool for the Editor.js allows to include code examples in your articles.
 */
export default class CodeTool implements BlockTool {
  /** 
  * Editor.js API
  */
  private api: API;
  /**
  * Read-only mode flag
  */
  private readOnly: boolean;
  /**
   * CodeTool's placeholder
   */
  private placeholder: string;
  /**
   * CodeTool's CSS
   */
  private CSS: CodeToolCSS;
  /**
   * CodeTool nodes
   */
  private nodes: CodeToolNodes;
  /**
  * CodeTool's data
  */
  private _data!: CodeData;

  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported(): boolean {
    return true;
  }

  /**
   * Allow to press Enter inside the CodeTool textarea
   *
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks(): boolean {
    return true;
  }

  /**
   * @typedef {object} CodeData — plugin saved data
   * @property {string} code - previously saved plugin code
   */

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} options - tool constricting options
   * @param {CodeData} options.data — previously saved plugin code
   * @param {object} options.config - user config for Tool
   * @param {object} options.api - Editor.js API
   * @param {boolean} options.readOnly - read only mode flag
   */
  constructor({ data, config, api, readOnly }: BlockToolConstructorOptions) {
    this.api = api;
    this.readOnly = readOnly;

    this.placeholder = this.api.i18n.t(config.placeholder || CodeTool.DEFAULT_PLACEHOLDER);

    this.CSS = {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,
      wrapper: 'ce-code',
      textarea: 'ce-code__textarea',
    };

    this.nodes = {
      holder: null,
      textarea: null,
    };

    this.data = {
      code: data.code || '',
    };

    this.nodes.holder = this.drawView();
  }

  /**
   * Create Tool's view
   *
   * @returns {HTMLDivElement}
   * @private
   */
  private drawView(): HTMLDivElement {
    const wrapper = document.createElement('div') as HTMLDivElement;
    const textarea = document.createElement('textarea');

    wrapper.classList.add(this.CSS.baseClass, this.CSS.wrapper);
    textarea.classList.add(this.CSS.textarea, this.CSS.input);
    textarea.textContent = this.data.code;

    textarea.placeholder = this.placeholder;

    if (this.readOnly) {
      textarea.disabled = true;
    }

    wrapper.appendChild(textarea);

    /**
     * Enable keydown handlers
     */
    textarea.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'Tab':
          this.tabHandler(event);
          break;
      }
    });

    this.nodes.textarea = textarea;

    return wrapper;
  }

  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement} this.nodes.holder - Code's wrapper
   * @public
   */
  public render(): HTMLDivElement {
    return this.nodes.holder!;
  }

  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLDivElement} codeWrapper - CodeTool's wrapper, containing textarea with code
   * @returns {CodeData} - saved plugin code
   * @public
   */
  public save(codeWrapper: HTMLDivElement): CodeData {
    return {
      code: codeWrapper.querySelector('textarea')!.value,
    };
  }

  /**
   * onPaste callback fired from Editor`s core
   *
   * @param {PasteEvent} event - event with pasted content
   */
  public onPaste(event: PasteEvent): void {
    const detail = event.detail;

    if ('data' in detail) {
      const content = detail.data as string;
      this.data = {
        code: content || '',
      };
    }
  }

  /**
   * Returns Tool`s data from private property
   *
   * @returns {CodeData}
   */
  public get data(): CodeData {
    return this._data;
  }

  /**
   * Set Tool`s data to private property and update view
   *
   * @param {CodeData} data - saved tool data
   */
  public set data(data: CodeData) {
    this._data = data;

    if (this.nodes.textarea) {
      this.nodes.textarea.textContent = data.code;
    }
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox(): { icon: string; title: string } {
    return {
      icon: IconBrackets,
      title: 'Code',
    };
  }

  /**
   * Default placeholder for CodeTool's textarea
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_PLACEHOLDER(): string {
    return 'Enter a code';
  }

  /**
   *  Used by Editor.js paste handling API.
   *  Provides configuration to handle CODE tag.
   *
   * @static
   * @returns {{tags: string[]}}
   */
  static get pasteConfig(): { tags: string[] } {
    return {
      tags: ['pre'],
    };
  }

  /**
   * Automatic sanitize config
   *
   * @returns {{code: boolean}}
   */
  static get sanitize(): { code: boolean } {
    return {
      code: true, // Allow HTML tags
    };
  }

  /**
   * Handles Tab key pressing (adds/removes indentations)
   *
   * @private
   * @param {KeyboardEvent} event - keydown
   * @returns {void}
   */
  private tabHandler(event: KeyboardEvent): void {
    /**
     * Prevent editor.js tab handler
     */
    event.stopPropagation();

    /**
     * Prevent native tab behaviour
     */
    event.preventDefault();

    const textarea = event.target as HTMLTextAreaElement;
    const isShiftPressed = event.shiftKey;
    const caretPosition = textarea.selectionStart;
    const value = textarea.value;
    const indentation = '  ';

    let newCaretPosition;

    /**
     * For Tab pressing, just add an indentation to the caret position
     */
    if (!isShiftPressed) {
      newCaretPosition = caretPosition + indentation.length;

      textarea.value = value.substring(0, caretPosition) + indentation + value.substring(caretPosition);
    } else {
      /**
       * For Shift+Tab pressing, remove an indentation from the start of line
       */
      const currentLineStart = getLineStartPosition(value, caretPosition);
      const firstLineChars = value.substr(currentLineStart, indentation.length);

      if (firstLineChars !== indentation) {
        return;
      }

      /**
       * Trim the first two chars from the start of line
       */
      textarea.value = value.substring(0, currentLineStart) + value.substring(currentLineStart + indentation.length);
      newCaretPosition = caretPosition - indentation.length;
    }

    /**
     * Restore the caret
     */
    textarea.setSelectionRange(newCaretPosition, newCaretPosition);
  }
}
