import { Node, mergeAttributes } from '@tiptap/core';

export interface ComparisonEmbedOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    comparisonEmbed: {
      setComparisonEmbed: (options: { product1_id: string; product2_id: string }) => ReturnType;
    };
  }
}

export const ComparisonEmbed = Node.create<ComparisonEmbedOptions>({
  name: 'comparisonEmbed',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'comparison-embed-node',
      },
    };
  },

  addAttributes() {
    return {
      product1_id: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-product1-id'),
        renderHTML: (attributes) => {
          if (!attributes.product1_id) return {};
          return { 'data-product1-id': attributes.product1_id };
        },
      },
      product2_id: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-product2-id'),
        renderHTML: (attributes) => {
          if (!attributes.product2_id) return {};
          return { 'data-product2-id': attributes.product2_id };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="comparison-embed"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'comparison-embed',
      }),
      'Comparison Block',
    ];
  },

  addCommands() {
    return {
      setComparisonEmbed:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
