import { useMemo, createElement } from 'react';
import { parse, TextNode, ElementNode, RootNode } from 'svg-parser';
import ReactDOMServer from 'react-dom/server';
import { GetServerSideProps, NextPage } from 'next';

const supportedStyleProps = [
  'color',
  'dominantBaseline',
  'fill',
  'fillOpacity',
  'fillRule',
  'opacity',
  'stroke',
  'strokeWidth',
  'strokeOpacity',
  'strokeLinecap',
  'strokeDasharray',
  'transform',
  'textAnchor',
  'visibility'
];

function isElementNode(node: TextNode | ElementNode): node is ElementNode {
  return node.type === 'element';
}

function removeLineBreaks(text?: string | number | boolean) {
  if (typeof text === 'string') {
    return text.replace(/(\r\n|\n|\r)/gm, '');
  }

  return text;
}

// https://dev.to/qausim/convert-html-inline-styles-to-a-style-object-for-react-components-2cbi
const formatStringToCamelCase = (str: string) => {
  const splitted = str.split('-');
  if (splitted.length === 1) return splitted[0];
  return (
    splitted[0] +
    splitted
      .slice(1)
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join('')
  );
};

const getStyleObjectFromString = (str: string | null) => {
  const style: any = {};
  if (!str) return {};

  str.split(';').forEach(el => {
    let [property, value] = el.split(':');
    if (!property) return;
    if (property === 'cursor') return;
    const formattedProperty = formatStringToCamelCase(property.trim());
    if (supportedStyleProps.includes(formattedProperty)) {
      if (formattedProperty === 'strokeDasharray') {
        value = value.replace(/pt/g, ''); //dasharray has now px
      }
      style[formattedProperty] = value.trim();
    }
  });

  return style;
};
function handleRelativePositioning(
  node: ElementNode,
  parentX?: number,
  parentY?: number
) {
  return {
    x:
      Number(node.properties?.x ?? parentX ?? 0) +
      Number(node.properties?.dx ?? 0),
    y:
      Number(node.properties?.y ?? parentY ?? 0) +
      Number(node.properties?.dy ?? 0)
  };
}

function getParentPosition(pos: number | string | undefined) {
  if (!pos) return 0;
  if (typeof pos === 'string') return Number(pos);
  return pos;
}

function svgToJSXWithRelPositioning(
  node: TextNode | ElementNode | string,
  key?: string,
  parentX?: number,
  parentY?: number
): any {
  if (typeof node === 'string') {
    return removeLineBreaks(node);
  }
  if (!isElementNode(node)) {
    return removeLineBreaks(node.value);
  }
  const elementName = node.tagName;
  if (!elementName) {
    return null;
  }
  let componentProps;
  if (node.tagName === 'desc' || node.tagName === 'defs') return null;

  if (node.properties !== undefined) {
    if (
      node.tagName === 'text' ||
      node.tagName === 'tspan' ||
      node.tagName === 'rect'
    ) {
      componentProps = handleRelativePositioning(node, parentX, parentY);
      if (node.tagName !== 'rect') {
        componentProps = {
          ...componentProps,
          textAnchor: node.properties['text-anchor']
        };
      } else {
        componentProps = {
          ...node.properties,
          ...componentProps
        };
      }
    } else {
      componentProps = node.properties;
    }
    if (node.properties.style) {
      componentProps = {
        ...componentProps,
        style: getStyleObjectFromString(node.properties.style as string)
      };
    }
  }
  let children = [];
  if (node.children && node.children.length > 0) {
    children = node.children.map(
      (childNode: TextNode | ElementNode | string, i: number) =>
        svgToJSXWithRelPositioning(
          childNode,
          key + '-' + i,
          getParentPosition(node.properties!.x),
          getParentPosition(node.properties!.y)
        )
    );
  } else {
    children = [''];
  }
  componentProps = { ...componentProps, key: key ?? 'root' };
  return createElement(elementName.toUpperCase(), componentProps, children);
}

export const SvgComponent = ({ children }: { children: JSX.Element }) => {
  const svgElement = useMemo(() => {
    const svgString = ReactDOMServer.renderToString(children);
    if (!svgString || svgString === '' || typeof svgString !== 'string')
      return <></>;

    const svg = svgString.replace(/px/g, 'pt'); //replace all px with pt
    const parsed: RootNode = parse(svg);
    return svgToJSXWithRelPositioning(parsed.children[0]);
  }, [children]);
  return <>{svgElement}</>;
};
