// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import DelegateFocusMixin from "./DelegateFocusMixin.js";
import ToggledPopupSource from "./ToggledPopupSource.js";

export default class PopupButton extends DelegateFocusMixin(
  ToggledPopupSource
) {}
