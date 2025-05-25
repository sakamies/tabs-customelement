export class Tabs extends HTMLElement {
  static observedAttributes = ['activation']

  constructor() {super()}

  get orientation() {return this.getAttribute('aria-orientation')}
  get activation() {return this.getAttribute('activation')}
  get tabs() {return Array.from(this.querySelectorAll('button'))}
  panel(tab) {return document.getElementById(tab.value)}
  select(tab) {
    const panel = this.panel(tab)
    if (!this.#dispatch(tab, panel)) return

    const selectedId = tab.value
    this.tabs.forEach(tab => {
      //TODO: skip disabled buttons?
      const panel = this.panel(tab)
      const isSelected = panel.id === selectedId
      tab.setAttribute('aria-selected', isSelected)
      tab.tabIndex = (!isSelected * -1).toString() //0 if isSelected is true, -1 if false
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
    const orientation = this.orientation
    const nextKey = orientation === 'vertical' && e.key === 'ArrowDown' || e.key === 'ArrowRight'
    const prevKey = orientation === 'vertical' && e.key === 'ArrowUp' || e.key === 'ArrowLeft'
    if (!nextKey && !prevKey) return

    //TODO: skip disabled buttons?
    const tabs = this.tabs
    const tab = e.target.closest('button')
    const index = tabs.indexOf(tab)
    let nextTab
    if (nextKey) {
      nextTab = tabs[index + 1] || tabs[0] //find next tab or wrap to first
    } else if (prevKey) {
      nextTab = tabs[index - 1] || tabs[tabs.length - 1] //find prev tab or wrap to last
    }
    nextTab.focus()
    if (this.activation !== 'manual') {
      this.select(nextTab)
    }
  }

  #listen() {
    this.addEventListener('click', this.#handleClick)
    this.addEventListener('keydown', this.#handleKey)
  }
  #unlisten() {
    this.removeEventListener('click', this.#handleClick)
    this.removeEventListener('keydown', this.#handleKey)
  }

  setup() {
    this.role = 'tablist'
    const tabs = this.tabs
    const selectedTab = this.querySelector('[aria-selected="true"]')

    tabs.forEach(tab => {
      //TODO: handle disabled buttons. Make a panel for disabled buttons always hidden?
      const panel = this.panel(tab)

      tab.type = 'button'
      tab.tabIndex = -1
      tab.role = 'tab'
      tab.setAttribute('aria-controls', panel.id)

      if (!tab.id) {
        let safeid = panel.id + '-tab'
        if (document.getElementById(safeid)) safeid = crypto.randomUUID()
        tab.id = safeid
      }

      panel.role = 'tabpanel'
      if (panel.getAttribute('aria-label') === null && panel.getAttribute('aria-labelledby') === null) {
        panel.setAttribute('aria-labelledby', tab.id)
      }
      if (panel.getAttribute('tabindex') === null) panel.tabIndex = 0
    })

    this.select(selectedTab || tabs[0])
    this.#listen()
  }

  connectedCallback() {
    if (document.readyState !== 'complete') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setup()
      })
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