import React from 'react';
import Link from 'next/link';

interface ContentRendererProps {
  content: any; // Tiptap JSON
  components?: {
    productEmbed?: React.ComponentType<{ id: string }>;
    beanEmbed?: React.ComponentType<{ id: string }>;
    comparisonEmbed?: React.ComponentType<{ product1Id: string, product2Id: string }>;
  };
}

export function ContentRenderer({ content, components }: ContentRendererProps) {
  if (!content) return null;

  // If it's a string, it might be stringified JSON or plain text
  let parsedContent = content;
  if (typeof content === 'string') {
    try {
      parsedContent = JSON.parse(content);
    } catch {
      return <div className="prose prose-invert max-w-none">{content}</div>;
    }
  }

  // Ensure it's a valid Tiptap document
  if (parsedContent.type !== 'doc' || !Array.isArray(parsedContent.content)) {
    return null;
  }

  const renderNode = (node: any, index: number) => {
    switch (node.type) {
      case 'doc':
        return <div key={index}>{renderChildren(node.content)}</div>;
      case 'paragraph':
        return <p key={index} className="mb-4">{renderChildren(node.content)}</p>;
      case 'heading':
        const HeadingTag = `h${node.attrs?.level || 2}` as any;
        const text = node.content?.map((n: any) => n.text).join('') || '';
        const id = text ? text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : undefined;
        return <HeadingTag key={index} id={id} className={`font-black mt-8 mb-4 ${node.attrs?.level === 2 ? 'text-2xl' : 'text-xl'}`}>{renderChildren(node.content)}</HeadingTag>;
      case 'bulletList':
        return <ul key={index}>{renderChildren(node.content)}</ul>;
      case 'orderedList':
        return <ol key={index}>{renderChildren(node.content)}</ol>;
      case 'listItem':
        return <li key={index}>{renderChildren(node.content)}</li>;
      case 'blockquote':
        return <blockquote key={index}>{renderChildren(node.content)}</blockquote>;
      case 'callout':
        const intent = node.attrs?.intent || 'info';
        let bgClass = 'bg-blue-100 text-blue-900 border-blue-500';
        if (intent === 'warning') bgClass = 'bg-red-100 text-red-900 border-red-500';
        if (intent === 'tip') bgClass = 'bg-green-100 text-green-900 border-green-500';
        return (
          <div key={index} className={`p-4 my-4 border-l-4 ${bgClass} font-medium`}>
            {renderChildren(node.content)}
          </div>
        );
      case 'horizontalRule':
        return <hr key={index} />;
      case 'text':
        return <TextNode key={index} node={node} />;
      case 'productEmbed':
        if (components?.productEmbed) {
          const ProductEmbed = components.productEmbed;
          return <ProductEmbed key={index} id={node.attrs?.id} />;
        }
        return <div key={index} className="p-4 border-2 border-dashed border-gray-500 my-4 text-center">Product Embed: {node.attrs?.id}</div>;
      case 'beanEmbed':
        if (components?.beanEmbed) {
          const BeanEmbed = components.beanEmbed;
          return <BeanEmbed key={index} id={node.attrs?.id} />;
        }
        return <div key={index} className="p-4 border-2 border-dashed border-gray-500 my-4 text-center">Bean Embed: {node.attrs?.id}</div>;
      case 'comparisonEmbed':
        if (components?.comparisonEmbed) {
          const ComparisonEmbed = components.comparisonEmbed;
          return <ComparisonEmbed key={index} product1Id={node.attrs?.product1_id} product2Id={node.attrs?.product2_id} />;
        }
        return <div key={index} className="p-4 border-2 border-dashed border-gray-500 my-4 text-center">Comparison Embed: {node.attrs?.product1_id} vs {node.attrs?.product2_id}</div>;
      
      default:
        console.warn(`Unsupported node type: ${node.type}`);
        return null;
    }
  };

  const renderChildren = (contentArr?: any[]) => {
    if (!contentArr || !Array.isArray(contentArr)) return null;
    return contentArr.map((n, i) => renderNode(n, i));
  };

  return (
    <div className="prose prose-invert max-w-none tiptap-content">
      {parsedContent.content.map((node: any, index: number) => (
        renderNode(node, index)
      ))}
    </div>
  );
}

function TextNode({ node }: { node: any }) {
  let element = <>{node.text}</>;

  if (node.marks && Array.isArray(node.marks)) {
    node.marks.forEach((mark: any) => {
      switch (mark.type) {
        case 'bold':
          element = <strong>{element}</strong>;
          break;
        case 'italic':
          element = <em>{element}</em>;
          break;
        case 'underline':
          element = <u>{element}</u>;
          break;
        case 'strike':
          element = <s>{element}</s>;
          break;
        case 'code':
          element = <code>{element}</code>;
          break;
        case 'link':
          const href = mark.attrs?.href;
          const target = mark.attrs?.target || '_blank';
          const rel = mark.attrs?.rel || 'noopener noreferrer';
          
          if (href?.startsWith('/')) {
             element = <Link href={href}>{element}</Link>;
          } else {
             element = <a href={href} target={target} rel={rel}>{element}</a>;
          }
          break;
      }
    });
  }

  return element;
}
