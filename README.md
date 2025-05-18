# Tabs custom element

A minimal tabs custom element that tries to work exactly according to [ARIA Authoring Practices Guide (APG) Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/). Tries to follow the recommended pattern word for word. Doesn't do anything else.

Wrap some buttons with a `<tabs->` element. Make some elements with id's. Target those id's with a `value` attribute on your buttons.

The example in `index.html` has minimal styling, but the elements are just buttons and sections, so style however fits your project. Inspect the elements with devtools to see what attributes are added to the buttons and sections. There is no hidden state, just attributes.

## Usage

[Import the script](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) into your document and [register the element](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#registering_a_custom_element).

```html
<script type="module">
  import {Tabs} from '/tabs.js'
  customElements.define('tabs-', Tabs)
</script>
```

```html
<tabs->
  <button value="tab-a-id">Tab A</button>
  <button value="tab-b-id">Tab B</button>
</tabs->
<section id="tab-a-id">Tab A content</section>
<section id="tab-b-id">Tab B content</section>
```

## Attributes

### `aria-orientation`

A standard aria attribute that applies to tabs. Set `aria-orientation="vertical"` if you are styling the tab buttons to have a vertically stacked layout. This will have up & down arrows change tabs instead of left & right.

### `activation`

You can set `activation="manual"` if you don't want the tabs to change immediately on arrow key press. This means that tab buttons will get focused when you press arrow keys, but you will need to press Space or Enter to activate the focused tab.

## Extra

You can use any html inside `<tabs->` if you need to. The tabs element only cares that there are some buttons with values inside somewhere, and that there are elements that have ids that match those values somewhere.

You really really should only include buttons inside tabs and have your panels in order after the tabs, but that's not strictly required or enforced. It's just that users (especially screen reader users, but everybody really) expect tab contents to come right after the tabs. If you need some links or action buttons on the same row as the tabs or something like that, have those buttons come before the tabs in the html.

Why no `<tabs-><tab->Tab A<tab-></tabs->`, `<tab-panel>` or some such elements also? Well a tab _is a button_ and is specified to work like a button and browsers give all the basic interactivity and style hooks for free. Making any kind of custom clickable elements is just a big amount of useless extra work.

A `<tab-panel>` like element might make a smidge more sense, but it's just a generic container that gets its role overridden as `role=tabpanel` anyway, so didn't see any reason to.

----

## Licence, NPM module?

This repo is more of a journey of learning and writing, not necessarily meant as a participant in the packages & components ecosystem. Though I've tried to make this airtight and it should be fully production ready — *and I am using it in production* — I'm not promising anything.

This repo does not have a licence and is [not on NPM](https://htmx.org/essays/vendoring/). You do not have my permission for anything, but I hope your rebel spirit will let you learn from this, to code your own and make a package. Give credit and [behave](https://www.contributor-covenant.org).