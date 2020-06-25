import { updateChildNodes } from "../core/dom.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import { replace, transmute } from "../core/template.js";
import CursorAPIMixin from "./CursorAPIMixin.js";
import FormElementMixin from "./FormElementMixin.js";
import {
  defaultState,
  ids,
  raiseChangeEvents,
  render,
  setState,
  shadowRoot,
  state,
  stateEffects,
  template,
} from "./internal.js";
import ItemsAPIMixin from "./ItemsAPIMixin.js";
import ItemsCursorMixin from "./ItemsCursorMixin.js";
import PopupButton from "./PopupButton.js";
import PopupSelectMixin from "./PopupSelectMixin.js";
import SelectedTextAPIMixin from "./SelectedTextAPIMixin.js";
import SelectedValueAPIMixin from "./SelectedValueAPIMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";

const Base = CursorAPIMixin(
  FormElementMixin(
    ItemsAPIMixin(
      ItemsCursorMixin(
        SelectedTextAPIMixin(
          SelectedValueAPIMixin(
            SingleSelectAPIMixin(SlotItemsMixin(PopupSelectMixin(PopupButton)))
          )
        )
      )
    )
  )
);

/**
 * Shows a single choice made from a pop-up list of choices
 *
 * @inherits PopupButton
 * @mixes FormElementMixin
 * @mixes SelectedTextAPIMixin
 * @mixes SelectedValueAPIMixin
 * @mixes SingleSelectAPIMixin
 * @mixes SlotItemsMixin
 * @part {div} list - the list shown in the popup
 * @part down-icon - the icon shown in the toggle if the popup will open or close in the down direction
 * @part up-icon - the icon shown in the toggle if the popup will open or close in the up direction
 * @part {div} value - region inside the toggle button showing the value of the current selection
 */
class DropdownList extends Base {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      ariaHasPopup: "listbox",
      currentItemRequired: true,
      listPartType: "div",
      selectedIndex: -1,
      selectedItem: null,
      valuePartType: "div",
    });
  }

  get items() {
    /** @type {any} */
    const list = this[ids] && this[ids].list;
    return list ? list.items : null;
  }

  /**
   * The class or tag used to define the `list` part – the element
   * presenting the list items and handling navigation between them.
   *
   * @type {PartDescriptor}
   * @default List
   */
  get listPartType() {
    return this[state].listPartType;
  }
  set listPartType(listPartType) {
    this[setState]({ listPartType });
  }

  [render](/** @type {ChangedFlags} */ changed) {
    super[render](changed);

    renderParts(this[shadowRoot], this[state], changed);

    if (changed.listPartType) {
      // If the user mouses up on a list item, close the list with that item as
      // the close result.
      this[ids].list.addEventListener("mouseup", async (event) => {
        // If we're doing a drag-select (user moused down on button, dragged
        // mouse into list, and released), we close. If we're not doing a
        // drag-select (the user opened the list with a complete click), and
        // there's a selection, they clicked on an item, so also close.
        // Otherwise, the user clicked the list open, then clicked on a list
        // separator or list padding; stay open.
        const popupCurrentIndex = this[state].popupCurrentIndex;
        if (this[state].dragSelect || popupCurrentIndex >= 0) {
          // We don't want the document mouseup handler to close
          // before we've asked the list to highlight the selection.
          // We need to stop event propagation here, before we enter
          // any async code, to actually stop propagation.
          event.stopPropagation();
          this[raiseChangeEvents] = true;
          await this.selectCurrentItemAndClose();
          this[raiseChangeEvents] = false;
        } else {
          event.stopPropagation();
        }
      });

      // Track changes in the list's selection state.
      this[ids].list.addEventListener("currentindexchange", (event) => {
        this[raiseChangeEvents] = true;
        /** @type {any} */
        const cast = event;
        this[setState]({
          popupCurrentIndex: cast.detail.currentIndex,
        });
        this[raiseChangeEvents] = false;
      });
    }

    // if (changed.itemRole) {
    //   if ("itemRole" in this[ids].list) {
    //     /** @type {any} */ (this[ids].list).itemRole = this[state].itemRole;
    //   }
    // }

    // Update selection.
    if (changed.items || changed.selectedIndex) {
      const { items, selectedIndex } = this[state];
      const selectedItem = items ? items[selectedIndex] : null;

      // Show selection in value part.
      const clone = selectedItem ? selectedItem.cloneNode(true) : null;
      const childNodes = clone ? clone.childNodes : [];
      updateChildNodes(this[ids].value, childNodes);

      // Mark only the selected item as selected.
      if (items) {
        items.forEach((/** @type {any} */ item) => {
          if ("selected" in item) {
            item.selected = item === selectedItem;
          }
        });
      }
    }

    // The current item in the popup is represented in the list.
    if (changed.popupCurrentIndex) {
      const list = /** @type {any} */ (this[ids].list);
      if ("currentIndex" in list) {
        list.currentIndex = this[state].popupCurrentIndex;
      }
    }
  }

  [stateEffects](state, changed) {
    const effects = super[stateEffects](state, changed);

    // When opening the popup, by default (re)select the current item.
    if (changed.opened && state.opened) {
      Object.assign(effects, {
        popupCurrentIndex: state.selectedIndex,
      });
    }

    // When the popup closes, update our selection from the list selection.
    if (changed.opened && !state.opened) {
      const { closeResult, items } = state;
      if (items && closeResult !== undefined) {
        const selectedIndex = items.indexOf(closeResult);
        Object.assign(effects, {
          selectedIndex,
        });
      }
    }

    // If we get items and don't have a selection, select the first item.
    if (changed.items || changed.selectedIndex) {
      const { items, selectedIndex } = state;
      if (selectedIndex < 0 && items && items.length > 0) {
        Object.assign(effects, {
          selectedIndex: 0,
        });
      }
    }

    // MenuButton sets popupCurrentIndex to -1 if the user isn't hovering
    // over the menu, but for the dropdown list pattern, we'd prefer to
    // default to showing the selected item.
    // if (changed.popupCurrentIndex) {
    //   const { popupCurrentIndex, selectedIndex } = state;
    //   if (popupCurrentIndex === -1 && selectedIndex >= 0) {
    //     Object.assign(effects, {
    //       popupCurrentIndex: selectedIndex,
    //     });
    //   }
    // }

    return effects;
  }

  get [template]() {
    const result = super[template];

    // Replace the source slot with an element to show the value.
    const sourceSlot = result.content.querySelector('slot[name="source"]');
    if (sourceSlot) {
      replace(
        sourceSlot,
        fragmentFrom.html` <div id="value" part="value"></div> `
      );
    }

    // Wrap default slot with a list.
    const defaultSlot = result.content.querySelector("slot:not([name])");
    if (defaultSlot) {
      defaultSlot.replaceWith(fragmentFrom.html`
        <div id="list" part="list">
          <slot></slot>
        </div>
      `);
    }

    renderParts(result.content, this[state]);

    result.content.append(fragmentFrom.html`
      <style>
        [part~="list"] {
          max-height: 100%;
        }
      </style>
    `);

    return result;
  }

  /**
   * The class or tag used to create the `value` part - the region
   * showing the dropdown list's current value.
   *
   * @type {PartDescriptor}
   * @default 'div'
   */
  get valuePartType() {
    return this[state].valuePartType;
  }
  set valuePartType(valuePartType) {
    this[setState]({ valuePartType });
  }
}

/**
 * Render parts for the template or an instance.
 *
 * @private
 * @param {DocumentFragment} root
 * @param {PlainObject} state
 * @param {ChangedFlags} [changed]
 */
function renderParts(root, state, changed) {
  if (!changed || changed.listPartType) {
    const { listPartType } = state;
    const list = root.getElementById("list");
    if (list) {
      transmute(list, listPartType);
    }
  }
  if (!changed || changed.valuePartType) {
    const { valuePartType } = state;
    const value = root.getElementById("value");
    if (value) {
      transmute(value, valuePartType);
    }
  }
}

export default DropdownList;
