// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ReactiveElement from "../core/ReactiveElement.js";
import DelegateFocusMixin from "./DelegateFocusMixin.js";
import DelegateInputLabelMixin from "./DelegateInputLabelMixin.js";
import DelegateInputSelectionMixin from "./DelegateInputSelectionMixin.js";
import DisabledMixin from "./DisabledMixin.js";
import FocusVisibleMixin from "./FocusVisibleMixin.js";
import FormElementMixin from "./FormElementMixin.js";
import KeyboardDirectionMixin from "./KeyboardDirectionMixin.js";
import KeyboardMixin from "./KeyboardMixin.js";

export default class SpinBox extends DelegateFocusMixin(
  DelegateInputLabelMixin(
    DelegateInputSelectionMixin(
      DisabledMixin(
        FocusVisibleMixin(
          FormElementMixin(
            KeyboardDirectionMixin(KeyboardMixin(ReactiveElement))
          )
        )
      )
    )
  )
) {
  stepDown(): void;
  stepUp(): void;
  value: string;
}
