// shims/compat-next-link.js
// Compat shim that wraps Next.js Link and enforces legacyBehavior.
const React = require('react')
let NextLink
try {
  // prefer the package entry
  NextLink = require('next/link')
  NextLink = NextLink && NextLink.default ? NextLink.default : NextLink
} catch (e) {
  // fallback to internal client link if available
  try { NextLink = require('next/dist/client/link').default } catch (_) { NextLink = null }
}

function Link(props) {
  if (!NextLink) {
    // if we can't resolve Next's Link, render children directly
    return React.createElement(React.Fragment, null, props.children)
  }
  // ensure legacyBehavior is present (do not override if explicitly provided)
  const withLegacy = Object.assign({}, props)
  if (withLegacy.legacyBehavior === undefined) withLegacy.legacyBehavior = true
  return React.createElement(NextLink, withLegacy)
}

module.exports = Link
module.exports.default = Link
