import './index.css';
import { getLineStartPosition } from './utils/string';
import { IconBrackets } from '@codexteam/icons';
import type { API, BlockTool, BlockToolConstructorOptions, BlockToolData, PasteConfig, PasteEvent, SanitizerConfig, ToolboxConfig } from '@editorjs/editorjs';

/**
 * CodeTool for Editor.js
 * @version 2.0.0
 * @license MIT
 */

/**
 * Data structure for CodeTool's data
 */
export interface CodeData extends BlockToolData {
  /**
   * The code content input by the user
   */
  code: string;
}

/**
 * Configuration options for the CodeTool provided by the user
 */
export interface CodeConfig {
  /**
   * Placeholder text to display in the input field when it's empty
   */
  placeholder: string;
}

/**
 * Defines the CSS class names used by CodeTool for styling its elements
 */
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

/**
 * Holds references to the DOM elements used by CodeTool
 */
interface CodeToolNodes {
  /** Main container or Wrapper for CodeTool */
  holder: HTMLDivElement | null;
  /** Textarea where user inputs their code */
  textarea: HTMLTextAreaElement | null;
}

/**
 * Options passed to the constructor of a block tool
 */
interface CodeToolConstructorOptions extends BlockToolConstructorOptions {
  /**
   * Data specific to the CodeTool
   */
  data: CodeData;
}

/**
 * Code Tool for the Editor.js allows to include code examples in your articles.
 */
export default class CodeTool implements BlockTool {
  /**
   * API provided by Editor.js for interacting with the editor's core functionality
   */
  private api: API;
  /**
   * Indicates whether the editor is in read-only mode, preventing modifications
   */
  private readOnly: boolean;
  /**
   * Placeholder text displayed when there is no code content
   */
  private placeholder: string;
  /**
   * Collection of CSS class names used by CodeTool for styling its elements
   */
  private CSS: CodeToolCSS;
  /**
   * DOM nodes related to the CodeTool, including containers and other elements
   */
  private nodes: CodeToolNodes;
  /**
   * Stores the current data (code and other related properties) for the CodeTool
   */
  private _data!: CodeData;

  /**
   * Notify core that read-only mode is supported
   * @returns true if read-only mode is supported
   */
  public static get isReadOnlySupported(): boolean {
    return true;
  }

  /**
   * Allows pressing Enter key to create line breaks inside the CodeTool textarea
   * This enables multi-line input within the code editor.
   * @returns true if line breaks are allowed in the textarea
   */
  public static get enableLineBreaks(): boolean {
    return true;
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   * @param options - tool constricting options
   * @param options.data — previously saved plugin code
   * @param options.config - user config for Tool
   * @param options.api - Editor.js API
   * @param options.readOnly - read only mode flag
   */
  constructor({ data, config, api, readOnly }: CodeToolConstructorOptions) {
    this.api = api;
    this.readOnly = readOnly;

    this.placeholder = this.api.i18n.t(config.placeholder as string || CodeTool.DEFAULT_PLACEHOLDER);

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
      code: data.code ?? '',
    };

    this.nodes.holder = this.drawView();
  }

  /**
   * Return Tool's view
   * @returns this.nodes.holder - Code's wrapper
   */
  public render(): HTMLDivElement {
    return this.nodes.holder!;
  }

  /**
   * Extract Tool's data from the view
   * @param codeWrapper - CodeTool's wrapper, containing textarea with code
   * @returns - saved plugin code
   */
  public save(codeWrapper: HTMLDivElement): CodeData {
    return {
      code: codeWrapper.querySelector('textarea')!.value,
    };
  }

  /**
   * onPaste callback fired from Editor`s core
   * @param event - event with pasted content
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
   * @returns
   */
  public get data(): CodeData {
    return this._data;
  }

  /**
   * Set Tool`s data to private property and update view
   * @param data - saved tool data
   */
  public set data(data: CodeData) {
    this._data = data;

    if (this.nodes.textarea) {
      this.nodes.textarea.textContent = data.code;
    }
  }

  /**
   * Get Tool toolbox settings.
   * Provides the icon and title to display in the toolbox for the CodeTool.
   * @returns An object containing:
   * - icon: SVG representation of the Tool's icon
   * - title: Title to show in the toolbox
   */
  public static get toolbox(): ToolboxConfig {
    return {
      icon: IconBrackets,
      title: 'Code',
    };
  }

  /**
   * Default placeholder for CodeTool's textarea
   * @returns
   */
  public static get DEFAULT_PLACEHOLDER(): string {
    return 'Enter a code';
  }

  /**
   *  Used by Editor.js paste handling API.
   *  Provides configuration to handle CODE tag.
   * @returns
   */
  public static get pasteConfig(): PasteConfig {
    return {
      tags: ['pre'],
    };
  }

  /**
   * Automatic sanitize config
   * @returns
   */
  public static get sanitize(): SanitizerConfig {
    return {
      code: true, // Allow HTML tags
    };
  }

  /**
   * Handles Tab key pressing (adds/removes indentations)
   * @param event - keydown
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

  /**
   * Create Tool's view
   * @returns
   */
  private drawView(): HTMLDivElement {
    const wrapper = document.createElement('div');
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
}
