// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import AriaRoleMixin from "./AriaRoleMixin.js";
import DelegateFocusMixin from "./DelegateFocusMixin.js";
import DelegateInputLabelMixin from "./DelegateInputLabelMixin.js";
import DelegateInputSelectionMixin from "./DelegateInputSelectionMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import FormElementMixin from "./FormElementMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";
import PopupSource from "./PopupSource.js";

export default class ComboBox extends AriaRoleMixin(
  DelegateFocusMixin(
    DelegateInputLabelMixin(
      DelegateInputSelectionMixin(
        FocusVisibleMixin(FormElementMixin(KeyboardMixin(PopupSource)))
      )
    )
  )
) {
  readonly input: Element | null;
  inputPartType: PartDescriptor;
  placeholder: string;
  popupTogglePartType: PartDescriptor;
  value: any;
}
