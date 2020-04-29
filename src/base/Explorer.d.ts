// Elix is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

import ReactiveElement from "../core/ReactiveElement.js";
import * as internal from "./internal.js";
import LanguageDirectionMixin from "./LanguageDirectionMixin.js";
import SingleSelectAPIMixin from "./SingleSelectAPIMixin.js";
import SlotItemsMixin from "./SlotItemsMixin.js";

export default class Explorer extends LanguageDirectionMixin(
  SingleSelectAPIMixin(SlotItemsMixin(ReactiveElement))
) {
  [internal.checkSize](): void;
  readonly proxies: Element[];
  proxyListOverlap: boolean;
  proxyListPosition: "bottom" | "end" | "left" | "right" | "start" | "top";
  proxyListPartType: PartDescriptor;
  proxyPartType: PartDescriptor;
  stagePartType: PartDescriptor;
}
