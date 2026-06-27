import { ExtractResult } from './types'

// Simple parser for Tiptap JSON content
export function extractFromTiptapJson(contentJson: any): ExtractResult {
  const result: ExtractResult = {
    plainText: '',
    headings: [],
    images: [],
    products: [],
    beans: [],
    comparisons: []
  }

  if (!contentJson || !contentJson.content) {
    return result
  }

  function traverse(node: any) {
    if (!node) return

    // Extract text
    if (node.type === 'text' && node.text) {
      result.plainText += node.text + ' '
    }

    // Extract headings
    if (node.type === 'heading') {
      let headingText = ''
      const getHeadingText = (n: any) => {
        if (n.text) headingText += n.text
        if (n.content) n.content.forEach(getHeadingText)
      }
      getHeadingText(node)
      if (headingText) {
        result.headings.push(headingText)
        result.plainText += headingText + ' ' // Headings are also part of plain text
      }
    }

    // Extract images
    if (node.type === 'image' && node.attrs?.src) {
      result.images.push(node.attrs.src)
    }

    // Extract custom embeds
    if (node.type === 'productEmbed' && node.attrs?.id) {
      result.products.push(node.attrs.id)
    }
    if (node.type === 'beanEmbed' && node.attrs?.id) {
      result.beans.push(node.attrs.id)
    }
    if (node.type === 'comparisonEmbed' && node.attrs?.id) {
      result.comparisons.push(node.attrs.id)
    }

    // Recurse
    if (node.content) {
      node.content.forEach(traverse)
    }
  }

  traverse(contentJson)

  // Clean up plain text
  result.plainText = result.plainText.replace(/\s+/g, ' ').trim()

  return result
}
