import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react';
import './App.css';
import { Editor, EditorContext } from './editor/editor';
import { Fanfic } from './fanfic/fanfiction';
import { Preview } from './preview';
import { TopMenu } from './topmenu/topmenu';

export enum WindowFocus {
  EDITOR_ONLY,
  BOTH,
  PREVIEW_ONLY
}

export class AppContext {
  private focus: WindowFocus = WindowFocus.BOTH;

  editor: EditorContext = new EditorContext();
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
          <Preview/>
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