import * as symbols from './symbols.js';
import * as template from './template.js';


const wrap = Symbol('wrap');


/**
 * Adds a page number and total page count to a carousel-like element.
 * 
 * This can be applied to components like [Carousel](Carousel) that renders
 * their content as pages.
 * 
 * @module PageNumbersMixin
 */
function PageNumbersMixin(Base) {

  class PageNumbers extends Base {

    [symbols.render](state, changed) {
      if (super[symbols.render]) { super[symbols.render](state, changed); }
      if (changed.selectedIndex) {
        const { selectedIndex } = state;
        const textContent = selectedIndex >= 0 && this.items ?
          `${selectedIndex + 1} / ${this.items.length}` :
          '';
        this.$.pageNumber.textContent = textContent;
      }
    }

    /**
     * Destructively wrap a node with elements to show page numbers.
     * 
     * @param {Node} original - the element that should be wrapped by page numbers
     */
    [wrap](original) {
      const pageNumbersTemplate = template.html`
        <div id="pageNumbers" role="none" style="display: flex; flex: 1; overflow: hidden;">
          <style>
            #pageNumber {
              bottom: 0;
              color: white;
              padding: 0.5em;
              position: absolute;
              right: 0;
            }
          </style>
          <div id="pageNumbersContainer" role="none" style="display: flex; flex: 1; overflow: hidden; position: relative;"></div>
          <div id="pageNumber"></div>
        </div>
      `;
      template.wrap(original, pageNumbersTemplate.content, '#pageNumbersContainer');
    }

  }

  return PageNumbers;
}


PageNumbersMixin.wrap = wrap;


export default PageNumbersMixin;
