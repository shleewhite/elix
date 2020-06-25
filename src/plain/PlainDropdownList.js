import DropdownList from "../base/DropdownList.js";
import { defaultState, template } from "../base/internal.js";
import { fragmentFrom } from "../core/htmlLiterals.js";
import PlainBorderButton from "./PlainBorderButton.js";
import PlainListBox from "./PlainListBox.js";
import PlainOpenCloseToggle from "./PlainOpenCloseToggle.js";
import PlainPopup from "./PlainPopup.js";

/**
 * DropdownList component in the Plain reference design system
 *
 * @inherits DropdownList
 * @part {PlainBorderButton} source
 * @part {PlainListBox} list
 * @part {PlainOpenCloseToggle} popup-toggle
 * @part {PlainPopup} popup
 */
class PlainDropdownList extends DropdownList {
  get [defaultState]() {
    return Object.assign(super[defaultState], {
      listPartType: PlainListBox,
      popupPartType: PlainPopup,
      sourcePartType: PlainBorderButton,
      popupTogglePartType: PlainOpenCloseToggle,
    });
  }

  get [template]() {
    const result = super[template];

    // Turn off list border.
    result.content.append(fragmentFrom.html`
      <style>
        [part~="list"] {
          border: none;
          outline: none;
        }
      </style>
    `);

    return result;
  }
}

export default PlainDropdownList;
