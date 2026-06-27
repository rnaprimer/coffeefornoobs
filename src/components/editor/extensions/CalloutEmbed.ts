import { Node, mergeAttributes } from '@tiptap/core';

export interface CalloutOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (options?: { intent?: 'info' | 'warning' | 'tip' }) => ReturnType;
      toggleCallout: (options?: { intent?: 'info' | 'warning' | 'tip' }) => ReturnType;
    };
  }
}

export const Callout = Node.create<CalloutOptions>({
  name: 'callout',

  group: 'block',

  content: 'inline*',

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'callout-node',
      },
    };
  },

  addAttributes() {
    return {
      intent: {
        default: 'info',
        parseHTML: (element) => element.getAttribute('data-intent'),
        renderHTML: (attributes) => {
          return { 'data-intent': attributes.intent };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const intent = HTMLAttributes['data-intent'] || 'info';
    let bgClass = 'bg-blue-100 text-blue-900 border-blue-500';
    if (intent === 'warning') bgClass = 'bg-red-100 text-red-900 border-red-500';
    if (intent === 'tip') bgClass = 'bg-green-100 text-green-900 border-green-500';

    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'callout',
        class: `p-4 my-4 border-l-4 ${bgClass} font-medium`,
      }),
      0, // 0 means the content goes here
    ];
  },

  addCommands() {
    return {
      setCallout:
        (options) =>
        ({ commands }) => {
          return commands.setNode(this.name, options);
        },
      toggleCallout:
        (options) =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph', options);
        },
    };
  },
});
