/*

Wrap buttons in your tabs element. Each button's `value` must match the `id` of its panel.

```html
<tabs->
  <button value="tab-a">Tab A</button>
  <button value="tab-b">Tab B</button>
</tabs->
<section id="tab-a">...</section>
<section id="tab-b">...</section>
```

- Set `aria-selected="true" on a button` to set initially selected tab. Defaults to the first tab.
- Set `aria-orientation="vertical"` on the tabs element for vertical tabs.
- Set `manual-activation` attributes on the tabs element to have arrow keys move focus only. Button click via keyboard activates focused tab.

Dispatches a cancellable `tag-name` event on the element when a tab changes, where tag-name is the tag name you have instantiated the element with.

*/

export class TabsElement extends HTMLElement {
  get tabs() {return Array.from(this.querySelectorAll('button'))}
  panel(tab) {return document.getElementById(tab.value)}
  select(tab, dispatchEvent = true) {
    if (!tab) return
    const selectedPanel = this.panel(tab)
    if (dispatchEvent && !this.#dispatch(tab, selectedPanel)) return

    this.tabs.forEach(tab => {
      const panel = this.panel(tab)
      const isSelected = panel === selectedPanel
      tab.setAttribute('aria-selected', isSelected)
      tab.tabIndex = isSelected ? 0 : -1
      panel.hidden = !isSelected
    })
  }

  #dispatch(tab, panel) {
    const event = new CustomEvent(this.localName, {
      cancelable: true,
      bubbles: true,
      detail: {tab, panel},
    })
    return this.dispatchEvent(event)
  }

  #handleClick = e => this.select(e.target.closest('button'))
  #handleKey = e => {
    const orientation = this.getAttribute('aria-orientation')
    const nextKey = orientation === 'vertical' ? e.key === 'ArrowDown' : e.key === 'ArrowRight'
    const prevKey = orientation === 'vertical' ? e.key === 'ArrowUp' : e.key === 'ArrowLeft'
    if (!nextKey && !prevKey) return

    const tab = e.target.closest('button')
    if (tab) e.preventDefault()
    const tabs = this.tabs.filter(t => !t.disabled)
    const index = tabs.indexOf(tab)
    let nextTab
    if (nextKey) {
      nextTab = tabs[index + 1] || tabs[0] //find next tab or wrap to first
    } else if (prevKey) {
      nextTab = tabs[index - 1] || tabs[tabs.length - 1] //find prev tab or wrap to last
    }
    nextTab.focus()
    if (this.getAttribute('manual-activation') === null) {
      this.select(nextTab)
    }
  }

  #listen() {
    this.addEventListener('click', this.#handleClick)
    this.addEventListener('keydown', this.#handleKey)
  }
  //TODO: use AbortController for removing events.
  #unlisten() {
    this.removeEventListener('click', this.#handleClick)
    this.removeEventListener('keydown', this.#handleKey)
  }

  setup() {
    this.role = 'tablist'
    const tabs = this.tabs
    const selectedTab = this.querySelector('[aria-selected="true"]')

    tabs.forEach(tab => {
      tab.type = 'button'
      tab.tabIndex = -1
      tab.role = 'tab'
      tab.setAttribute('aria-controls', tab.value)

      if (!tab.id) {
        let safeid = tab.value + '-tab'
        if (document.getElementById(safeid)) safeid = crypto.randomUUID()
        tab.id = safeid
      }

      const panel = this.panel(tab)
      if (!panel) {
        console.error(`No panel with id `${tab.value}` for tab button`, tab)
        return
      }

      panel.role = 'tabpanel'
      if (panel.getAttribute('aria-label') === null && panel.getAttribute('aria-labelledby') === null) {
        panel.setAttribute('aria-labelledby', tab.id)
      }
      if (panel.getAttribute('tabindex') === null) panel.tabIndex = 0
    })

    this.select(selectedTab || tabs[0], false)
    this.#listen()
  }

  connectedCallback() {
    //Might need to support dynamically added tabs later, but for now assumes that tabs are present on page load and don't change.
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setup()
      }, {once: true})
    } else {
      this.setup()
    }
  }
  disconnectedCallback() {
    this.#unlisten()
  }
  adoptedCallback() {
    this.#unlisten()
    this.#listen()
  }
}
