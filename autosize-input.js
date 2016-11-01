(function () {
  // Compile and cache the needed regular expressions.
  var SPACE = /\s/g
  var LESS_THAN = />/g
  var MORE_THAN = /</g

  // We need to swap out these characters with their character-entity
  // equivalents because we're assigning the resulting string to
  // `ghost.innerHTML`.
  function escape (str) {
    return str.replace(SPACE, '&nbsp;')
              .replace(LESS_THAN, '&lt;')
              .replace(MORE_THAN, '&gt;')
  }

  // Create the `ghost` element, with inline styles to hide it and ensure
  // that the text is all on a single line.
  function createGhostElement () {
    var ghost = document.createElement('div')
    ghost.style.cssText = 'box-sizing:content-box;display:inline-block;height:0;overflow:hidden;position:absolute;top:0;visibility:hidden;white-space:nowrap;'
    document.body.appendChild(ghost)
    return ghost
  }

  // Create the `ghost` element.
  var ghost = createGhostElement()

  function autosizeInput (elem, opts) {
    // Force `content-box` on the `elem`.
    elem.style.boxSizing = 'content-box'

    // Apply the `font-size` and `font-family` styles of `elem` on the
    // `ghost` element.
    var elemStyle = window.getComputedStyle(elem)
    var elemCssText = 'letter-spacing:' + elemStyle.letterSpacing +
                     ';font-feature-settings:' + elemStyle.fontFeatureSettings +
                     ';font-family:' + elemStyle.fontFamily +
                     ';font-kerning:' + elemStyle.fontKerning +
                     ';font-size:' + elemStyle.fontSize +
                     ';font-stretch:' + elemStyle.fontStretch +
                     ';font-style:' + elemStyle.fontStyle +
                     ';font-variant:' + elemStyle.fontVariant +
                     ';font-variant-caps:' + elemStyle.fontVariantCaps +
                     ';font-variant-ligatures:' + elemStyle.fontVariantLigatures +
                     ';font-variant-numeric:' + elemStyle.fontVariantNumeric +
                     ';font-weight:' + elemStyle.fontWeight +
                     ';text-indent:' + elemStyle.textIndent +
                     ';text-transform:' + elemStyle.textTransform

    // Helper function that:
    // 1. Copies the `font-family` and `font-size` of our `elem` onto `ghost`.
    // 2. Sets the contents of `ghost` to the specified `str`.
    // 3. Copies the width of `ghost` onto our `elem`.
    function set (str) {
      str = str || elem.value || elem.getAttribute('placeholder') || ''
      // Ensure that the `ghost` element still exists. If not, create it.
      if (ghost.parentNode == null) {
        ghost = createGhostElement()
      }
      ghost.style.cssText += elemCssText
      ghost.innerHTML = escape(str)
      var width = window.getComputedStyle(ghost).width
      elem.style.width = width
      return width
    }

    // Call `set` on every `input` event (IE9+).
    elem.addEventListener('input', function () {
      set()
    })

    // Initialise the `elem` width.
    var width = set()

    // Set `min-width` if `opts.minWidth` was set, and only if the initial
    // width is non-zero.
    if (opts && opts.minWidth && width !== '0px') {
      elem.style.minWidth = width
    }

    // Return the `set` function.
    return set
  }

  if (typeof module === 'object') {
    module.exports = autosizeInput
  } else {
    window.autosizeInput = autosizeInput
  }
})()
