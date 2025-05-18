# Tabs custom element

A minimal tabs custom element that tries to work exactly according to [ARIA Authoring Practices Guide (APG) Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/). Tries to follow the recommended pattern word for word. Doesn't do anything else.

Wrap some buttons with a `<tabs->` tab. Make some elements with id's. Target those id's with `value` attribute on your buttons.

The example in index.html has minimal styling, but the elements are just buttons and sections, so style however fits your project.

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

### `orientation`

TODO

### `activation`

TODO

## Extra

You can use any html inside `<tabs->` if you need to. The tabs element only cares that there are some buttons with values inside somewhere, and that there are elements that have ids that match those values somewhere.

----

## Licence, NPM module?

This repo is more of a journey of learning and writing, not necessarily meant as a participant in the packages & components ecosystem. Though I've tried to make this airtight and it should be fully production ready — *and I am using it in production* — I'm not promising anything.

This repo does not have a licence and is [not on NPM](https://htmx.org/essays/vendoring/). You do not have my permission for anything, but I hope your rebel spirit will let you learn from this, to code your own and make a package. Give credit and [behave](https://www.contributor-covenant.org).