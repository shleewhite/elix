import { ids, render, state, template } from "../../src/base/internal.js";
import SelectableMixin from "../../src/base/SelectableMixin.js";
import SlotContentMixin from "../../src/base/SlotContentMixin.js";
import { templateFrom } from "../../src/core/htmlLiterals.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";

const Base = SelectableMixin(SlotContentMixin(ReactiveElement));

class LabeledColorSwatch extends Base {
  [render](/** @type {PlainObject} */ changed) {
    super[render](changed);
    if (changed.content) {
      const content = this[state].content;
      const strings = content ? content.map((node) => node.textContent) : [];
      const color = strings.join("").toLowerCase();
      this[ids].swatch.style.backgroundColor = color;
    }
  }

  get [template]() {
    return templateFrom.html`
      <style>
        :host {
          align-items: center;
          display: inline-flex;
          white-space: nowrap;
        }

        #swatch {
          border-radius: 0.5em;
          box-shadow: 0 0 5px gray;
          box-sizing: border-box;
          display: inline-block;
          height: 1em;
          margin-right: 0.25em;
          width: 1em;
        }
      </style>
      <span id="swatch"></span>
      <span id="label">
        <slot></slot>
      </span>
    `;
  }
}

export default LabeledColorSwatch;
customElements.define("labeled-color-swatch", LabeledColorSwatch);
