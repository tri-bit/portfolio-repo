import { useState, useMemo, useCallback, useRef } from 'react';
import { Button } from 'react-bootstrap';

import isHotKey from 'is-hotkey';

import {
  Editor,
  createEditor,
  Transforms,
  Node,
  Element as SlateElement,
} from 'slate';
import { Slate, Editable, useSlate, withReact } from 'slate-react';
import { inBroswer } from '../srcClient/clientUtils';

import MHAJSON from './MHAJSON';

// based on https://github.com/ianstormtaylor/slate/blob/master/site/examples/richtext.tsx
// todo properl serialize value object to html/json etc for mongo storage

const MHATextEditor = (props) => {
  const { value, handleChange, styling } = props;
  // const [value, setValue] = useState(initialValue);

  // standard mode has styling
  // classified mode has
  // const editorMode = props.editorMode || 'standard';

  const characterLimit = props.characterLimit || 2500;

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const mhaEditor = useMemo(() => withReact(createEditor()), []);

  const characterCount = useRef(0);

  const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
  };

  const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format);

    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  // straight from the example
  const Element = ({ attributes, children, element }) => {
    switch (element.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>;
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>;
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>;
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>;
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>;
      default:
        return <p {...attributes}>{children}</p>;
    }
  };

  const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }

    if (leaf.code) {
      children = <code>{children}</code>;
    }

    if (leaf.italic) {
      children = <em>{children}</em>;
    }

    if (leaf.underline) {
      children = <u>{children}</u>;
    }

    return <span {...attributes}>{children}</span>;
  };

  const isBlockActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    });

    return !!match;
  };

  // (mostly) straight from the example
  const LIST_TYPES = ['numbered-list', 'bulleted-list'];

  const toggleBlock = (editor, format) => {
    console.log('toggleBlock', format);

    const isActive = isBlockActive(editor, format);
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        LIST_TYPES.includes(
          !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
        ),
      split: true,
    });

    const newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    };

    console.log({ newProperties });

    Transforms.setNodes(editor, newProperties);

    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  };

  const EditButton = ({ format }) => {
    const editor = useSlate();

    return (
      <Button
        variant="secondary"
        className="p-0 pl-1 pr-1 mr-1"
        onMouseDown={(e) => {
          e.preventDefault();
          console.log(format);
          // toggleBlock(editor, format);
          toggleMark(editor, format);
        }}
        active={isBlockActive(editor, format)}
      >
        {format}
      </Button>
    );
  };

  const ToolBar = () => {
    return (
      <div style={{ width: '100%', padding: 7, backgroundColor: 'black' }}>
        <EditButton format="bold" />
        <EditButton format="italic" />
        <EditButton format="underline" />
      </div>
    );
  };

  const renderCharacterCounter = () => {
    const count = inBroswer()
      ? document.querySelector('.slateEditable')?.textContent.length - 1
      : null;

    if (!count && count !== 0) {
      characterCount.current = 0;
      return null;
    }

    characterCount.current = count;
    const limitExceeded = characterLimitExceeded();

    return (
      <div className={limitExceeded ? 'mha__error' : ''}>
        {count} of maximum {characterLimit} characters.
      </div>
    );
  };

  const characterLimitExceeded = () => characterCount.current > characterLimit;

  const slateHandleValueChange = (newValue) => {
    //! characterLimitExceeded() && handleChange(newValue);
    handleChange(newValue);
  };

  return (
    <div>
      {renderCharacterCounter()}
      <div className="slateWrapper">
        {!handleChange && '!handleChange'}

        <Slate
          editor={mhaEditor}
          value={value || initialValue}
          // onChange={newValue => setValue(newValue)}
          onChange={(newValue) => slateHandleValueChange(newValue)}
        >
          <ToolBar />
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            className="slateEditable"
            placeholder="Enter description here..."
            onKeyDown={(e) => {
              for (const hotkey in HOTKEYS) {
                if (isHotKey(hotkey, e)) {
                  e.preventDefault();
                  console.log('hotkey toggle', HOTKEYS[hotkey]);
                  toggleMark(mhaEditor, HOTKEYS[hotkey]);
                }
              }
            }}
          />
        </Slate>
      </div>
    </div>
  );
};

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'Example text' }],
  },
];

export default MHATextEditor;
