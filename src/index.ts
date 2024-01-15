/**
 * Build styles
 */
import './index.css';
import { getLineStartPosition } from './utils/string';
// @ts-ignore
import { IconBrackets } from '@codexteam/icons';

import type { API, HTMLPasteEvent, ToolConfig } from "@editorjs/editorjs";

interface CodeData {
  code: string;
}

/**
 * CodeTool for Editor.js
 *
 * @author CodeX (team@ifmo.su)
 * @copyright CodeX 2018
 * @license MIT
 * @version 2.0.0
 */

/* global PasteEvent */

/**
 * Code Tool for the Editor.js allows to include code examples in your articles.
 */
export default class CodeTool {
  api: API;
  readOnly: boolean;
  _data: CodeData = {
    code: '',
  };
  config: ToolConfig;
  nodes: {
    holder: HTMLDivElement | null,
    textarea: HTMLTextAreaElement | null,
  };
  placeholder: string;
  CSS: {
    baseClass: string,
    wrapper: string,
    input: string,
    textarea: string
  };

  static get isReadOnlySupported() {
    return true;
  }

  static get enableLineBreaks() {
    return true;
  }

  constructor({ data, config, api, readOnly }: {
    api: API,
    readOnly: boolean,
    data: CodeData,
    config: ToolConfig
  }) {
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

  drawView() {
    const wrapper = document.createElement('div'),
      textarea = document.createElement('textarea');

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

  render(): HTMLDivElement | null {
    return this.nodes.holder;
  }

  save(codeWrapper: HTMLDivElement): CodeData {
    const textArea = codeWrapper.querySelector('textarea')
    if (textArea) {
      return {
        code: textArea.value,
      };
    }
    return {
      code: '',
    };
  }

  onPaste(event: HTMLPasteEvent) {
    const content = event.detail.data;

    this.data = {
      code: content.textContent || '',
    };
  }

  get data(): CodeData {
    return this._data;
  }

  set data(data) {
    this._data = data;

    if (this.nodes.textarea) {
      this.nodes.textarea.textContent = data.code;
    }
  }

  static get toolbox() {
    return {
      icon: IconBrackets,
      title: 'Code',
    };
  }

  static get DEFAULT_PLACEHOLDER() {
    return 'Enter a code';
  }

  static get pasteConfig() {
    return {
      tags: [ 'pre' ],
    };
  }

  static get sanitize() {
    return {
      code: true, // Allow HTML tags
    };
  }

  tabHandler(event: KeyboardEvent) {
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
