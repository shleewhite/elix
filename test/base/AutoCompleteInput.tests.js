import {
  autoComplete,
  default as AutoCompleteInput,
} from "../../src/base/AutoCompleteInput.js";
import { renderChanges } from "../../src/base/internal.js";
import { assert } from "../testHelpers.js";

customElements.define("auto-complete-input", AutoCompleteInput);

describe("AutoCompleteInput", () => {
  it("can match against texts", async () => {
    const fixture = new AutoCompleteInput();
    fixture.texts = ["Canary", "Cat", "Dog"];
    fixture.value = "C";
    autoComplete(fixture);
    fixture[renderChanges]();
    assert.equal(fixture.value, "Canary");
  });
});
