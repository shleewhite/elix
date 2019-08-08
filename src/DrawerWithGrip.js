import * as symbols from './symbols.js';
import * as template from './template.js';
import Drawer from './Drawer.js';
import SeamlessButton from './SeamlessButton.js';


/**
 * A drawer that includes an always-visible grip element
 * 
 * This variant of [Drawer](Drawer) includes a grip handle that remains visible
 * in the collapsed state. This both lets the user know the drawer is there, and
 * gives them a way to use a tap/click or swipe to open the drawer.
 * 
 * The default icon used to represent the handle can be replaced by slotting an
 * image or other element into the `grip` slot.
 * 
 * @inherits ReactiveElement
 * @elementrole {SeamlessButton} grip
 */
class DrawerWithGrip extends Drawer {

  componentDidMount() {
    super.componentDidMount();

    if (this.state.gripSize === null) {
      // Use the rendered size of the grip to set the gripSize. This will ensure
      // the grip is visible, peeking out from the edge of the drawer's container.
      const { fromEdge } = this.state;
      const vertical = fromEdge === 'top' || fromEdge === 'bottom';
      const dimension = vertical ? 'offsetHeight' : 'offsetWidth';
      const gripSize = this.$.grip[dimension];
      this.setState({ gripSize });
    }
  }

  get defaultState() {
    return Object.assign(super.defaultState, {
      gripRole: SeamlessButton
    });
  }

  /**
   * The class, tag, or template used to create the grip handle.
   * 
   * @type {Role}
   * @default SeamlessButton
   */
  get gripRole() {
    return this.state.gripRole;
  }
  set gripRole(gripRole) {
    this.setState({ gripRole });
  }

  [symbols.render](changed) {
    if (super[symbols.render]) { super[symbols.render](changed); }

    if (changed.gripRole) {
      template.transmute(this.$.grip, this.state.gripRole);
      this.$.grip.addEventListener('click', event => {
        // Clicking grip toggles drawer.
        this[symbols.raiseChangeEvents] = true;
        this.toggle();
        event.stopPropagation();
        this[symbols.raiseChangeEvents] = false;
      });
    }

    if (changed.fromEdge || changed.rightToLeft) {
      // Position the grip so it's at the outer edge of the drawer.
      const { fromEdge, rightToLeft } = this.state;

      // Determine what grid we'll use to relatively position the content and
      // the grip.
      const mapFromEdgeToGrid = {
        bottom: 'auto 1fr / auto',
        left: 'auto / 1fr auto',
        right: 'auto / auto 1fr',
        top: '1fr auto / auto'
      };
      mapFromEdgeToGrid.start = rightToLeft ?
        mapFromEdgeToGrid.right :
        mapFromEdgeToGrid.left;
      mapFromEdgeToGrid.end = rightToLeft ?
        mapFromEdgeToGrid.left :
        mapFromEdgeToGrid.right;

      // Determine what cell the grip will go in.
      const mapFromEdgeToGripCell = {
        bottom: '1 / 1',
        left: '1 / 2',
        right: '1 / 1',
        top: '2 / 1'
      }
      mapFromEdgeToGripCell.start = rightToLeft ?
        mapFromEdgeToGripCell.right :
        mapFromEdgeToGripCell.left;
      mapFromEdgeToGripCell.end = rightToLeft ?
        mapFromEdgeToGripCell.left :
        mapFromEdgeToGripCell.right;

      this.$.gripContainer.style.grid = mapFromEdgeToGrid[fromEdge];
      this.$.gripWorkaround.style.gridArea = mapFromEdgeToGripCell[fromEdge];
    }

    if (changed.swipeAxis && this.$.gripIcon) {
      // Rotate the default grip icon to reflect the swipe axis.
      const transform = this.state.swipeAxis === 'horizontal' ?
        'rotate(90deg)' :
        null;
      this.$.gripIcon.style.transform = transform;
    }
  }

  // Tell TrackpadSwipeMixin that the gripped content is the scrollable element
  // the user is going to try to scroll with the trackpad.
  get [symbols.scrollTarget]() {
    return this.$.grippedContent;
  }

  get [symbols.template]() {
    const result = super[symbols.template];

    // Replace the default slot with one that includes a grip element.
    // Default grip icon from Material Design icons "drag handle".
    //
    // The gripWorkaround element exists for Safari, which doesn't correctly
    // measure the grip dimensions in componentDidMount without it. Having
    // a div that's display: block instead of flex appears to be the reason
    // this helps.
    const gripTemplate = template.html`
      <style>
        #frame {
          display: flex;
          overflow: hidden;
        }

        #gripContainer {
          display: grid;
          height: 100%;
          width: 100%;
        }

        #grippedContent {
          overflow: auto;
        }
        :host([opened="false"]) #grippedContent {
          overflow: hidden;
        }

        #gripWorkaround {
          display: grid;
        }

        #grip {
          align-items: center;
          display: grid;
          justify-items: center;
        }
      </style>
      <div id="gripContainer">
        <div id="grippedContent">
          <slot></slot>
        </div>
        <div id="gripWorkaround">
          <div id="grip" aria-label="Toggle drawer">
            <slot name="grip">
              <svg id="gripIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
                <defs>
                  <path id="a" d="M0 0h24v24H0V0z"/>
                </defs>
                <clipPath id="b">
                  <use xlink:href="#a" overflow="visible"/>
                </clipPath>
                <path clip-path="url(#b)" d="M20 9H4v2h16V9zM4 15h16v-2H4v2z"/>
              </svg>
            </slot>
          </div>
        </div>
      </div>
    `;
    const defaultSlot = template.defaultSlot(result.content);
    if (defaultSlot) {
      template.transmute(defaultSlot, gripTemplate);
    }

    return result;
  }

}


customElements.define('elix-drawer-with-grip', DrawerWithGrip);
export default DrawerWithGrip;
