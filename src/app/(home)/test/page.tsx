'use client';
import React, {useEffect, useState, useMemo} from 'react';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const HtmlToReactParser = require('html-to-react').Parser;
const htmlToReactParser = new HtmlToReactParser();
const HtmlToReact = require('html-to-react');
const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions();

const processingInstructions = [
  {
    shouldProcessNode: function (node) {
      return node.name && node.name === 'h1';
    },
    processNode: function (node, children, index) {
      return React.createElement('h1', {key: index, class:"text-2xl"}, children);
    }
  },
  {
    shouldProcessNode: function (node) {
      return node.name && node.name === 'h2';
    },
    processNode: function (node, children, index) {
      return React.createElement('h2', {key: index, class:"text-xl"}, children);
    }
  },
  {
    shouldProcessNode: function (node) {
      return node.name && node.name === 'h3';
    },
    processNode: function (node, children, index) {
      return React.createElement('h3', {key: index, class:"text-lg"}, children);
    }
  },
  {
    shouldProcessNode: function (node) {
      return node.name && node.name === 'ol';
    },
    processNode: function (node, children, index) {
      return React.createElement('ol', {key: index, class:"pl-10 list-decimal"}, children);
    }
  },
  {
    shouldProcessNode: function (node) {
      return node.name && node.name === 'ul';
    },
    processNode: function (node, children, index) {
      return React.createElement('ul', {key: index, class:"pl-10 list-disc md:list-circle lg:list-square"}, children);
    }
  },
  {
    shouldProcessNode: function (node) {
      return true;
    },
    processNode: processNodeDefinitions.processDefaultNode,
  },
];

export default function Test() {
    const [convertedText, setConvertedText] = useState("Some default content");

    const reactElement = htmlToReactParser.parseWithInstructions(convertedText, ()=>true, processingInstructions);
    return (
      <main>
        <div>
          <ReactQuill
            theme='snow'
            value={convertedText}
            onChange={setConvertedText}
            style={{minHeight: '300px'}}
          />
          {reactElement}
        </div>
      </main>
    );
}