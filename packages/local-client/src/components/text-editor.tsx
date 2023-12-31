import './text-editor.css';
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useRef, useState } from "react";
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [editing, setEditing] = useState(false);
  const { updateCell } = useActions();

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref?.current?.contains(event?.target as Node)) {
        setEditing(false);
        return;
      }
    }

    document.addEventListener('click', listener, { capture: true })

    return () => {
      document.removeEventListener('click', listener, { capture: true })
    }
  }, [])


  if (editing) {
    return <div ref={ref} className='text-editor'>
      <MDEditor
        value={cell.content}
        onChange={e => updateCell(cell.id, e || '')}
      />
    </div>
  }

  return <div className='text-editor card' onClick={() => setEditing(true)}>
    <div className='card-content'>
      <MDEditor.Markdown source={cell.content || 'Click to edit'} style={{ whiteSpace: 'pre-wrap' }} />
    </div>
  </div>
};

export default TextEditor;