import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react';
import './App.css';
import { Editor, EditorContext } from './editor/editor';
import { EditorTarget } from './fanfic/editortarget';
import { Fanfic } from './fanfic/fanfiction';
import { Preview, PreviewContext } from './preview/preview';
import { TopMenu } from './topmenu/topmenu';

export enum WindowFocus {
  EDITOR_ONLY,
  BOTH,
  PREVIEW_ONLY
}

export class AppContext {
  private focus: WindowFocus = WindowFocus.BOTH;

  target: EditorTarget = new EditorTarget();

  editor: EditorContext = new EditorContext();
  preview: PreviewContext = new PreviewContext();
  fic: FanficContext = new FanficContext();

  constructor () {
    makeAutoObservable(this);
  }

  setFocus(focus: WindowFocus): void {
    this.focus = focus;
  }

  getFocus(): WindowFocus {
    return this.focus;  
  }
}

export class FanficContext {
  fic: Fanfic = new Fanfic("New Fanfic");

  constructor() {
    makeAutoObservable(this);
  }
}

let ctx: AppContext = new AppContext();

export const App = observer(()=>{
  return (
    <div className="app">
      <TopMenu ctx={ctx}/>
      <div className="app__main">
        <div className={"app__left-div " + focusClass(WindowFocus.EDITOR_ONLY, ctx.getFocus())}>
          <Editor ctx={ctx.editor} fic={ctx.fic}/>
        </div>
        <div className={"app__right-div " + focusClass(WindowFocus.PREVIEW_ONLY, ctx.getFocus())}>
          <Preview ctx={ctx.preview} targ={ctx.target} fic={ctx.fic}/>
        </div>
      </div>
    </div>
  );
});

function focusClass(is: WindowFocus, current: WindowFocus) {
  if(is == current) {
    return "app__window--maximized";
  } else if(current == WindowFocus.BOTH) {
    return "app__window--both";
  } else {
    return "app__window--minimized";
  }
}

export default App;