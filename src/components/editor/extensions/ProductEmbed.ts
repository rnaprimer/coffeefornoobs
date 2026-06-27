import { Node, mergeAttributes } from '@tiptap/core';

export interface ProductEmbedOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    productEmbed: {
      setProductEmbed: (options: { id: string }) => ReturnType;
    };
  }
}

export const ProductEmbed = Node.create<ProductEmbedOptions>({
  name: 'productEmbed',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'product-embed-node',
      },
    };
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-id'),
        renderHTML: (attributes) => {
          if (!attributes.id) return {};
          return {
            'data-id': attributes.id,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="product-embed"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'product-embed',
      }),
      'Product Block', // Placeholder for the actual node view if rendered in standard HTML
    ];
  },

  addCommands() {
    return {
      setProductEmbed:
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
