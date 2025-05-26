export class TabsElement extends HTMLElement {
  static observedAttributes = ['manual-activation']

  constructor() {super()}

  get tabs() {return Array.from(this.querySelectorAll('button'))}
  panel(tab) {return document.getElementById(tab.value)}
  select(tab) {
    const selectedPanel = this.panel(tab)
    if (!this.#dispatch(tab, selectedPanel)) return

    this.tabs.forEach(tab => {
      const panel = this.panel(tab)
      const isSelected = panel === selectedPanel
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
    const orientation = this.getAttribute('aria-orientation')
    const nextKey = orientation === 'vertical' && e.key === 'ArrowDown' || e.key === 'ArrowRight'
    const prevKey = orientation === 'vertical' && e.key === 'ArrowUp' || e.key === 'ArrowLeft'
    if (!nextKey && !prevKey) return

    const tab = e.target.closest('button')
    if (tab) event.preventDefault()
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
  #unlisten() {
    this.removeEventListener('click', this.#handleClick)
    this.removeEventListener('keydown', this.#handleKey)
  }

  setup() {
    this.role = 'tablist'
    const tabs = this.tabs
    const selectedTab = this.querySelector('[aria-selected="true"]')

    tabs.forEach(tab => {
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