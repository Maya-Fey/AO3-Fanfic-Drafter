import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Context } from 'vm';
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

export interface RetargetCapability {
  retarget(target: EditorTarget): void;
}

export class AppContext implements RetargetCapability {
  private focus: WindowFocus = WindowFocus.BOTH;

  target: EditorTarget = EditorTarget.targetFic();

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

  retarget(target: EditorTarget): void {
    if(this.target.equals(target)) return;
    this.target = target;
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
          <Editor ctx={ctx.editor} fic={ctx.fic} retarget={ctx}/>
          <MinimizedOverlay desired={WindowFocus.EDITOR_ONLY} ctx={ctx}></MinimizedOverlay>
        </div>
        <div className={"app__right-div " + focusClass(WindowFocus.PREVIEW_ONLY, ctx.getFocus())}>
          <Preview ctx={ctx.preview} targ={ctx.target} fic={ctx.fic}/>
          <MinimizedOverlay desired={WindowFocus.PREVIEW_ONLY} ctx={ctx}></MinimizedOverlay>
        </div>
      </div>
    </div>
  );
});

interface MinimizedOverlayProps extends React.HTMLProps<HTMLDivElement> {
  desired: WindowFocus,
  ctx: AppContext
};

function MinimizedOverlay(props: MinimizedOverlayProps) {
  if(props.desired == props.ctx.getFocus() || props.ctx.getFocus() == WindowFocus.BOTH) {
    return <React.Fragment></React.Fragment>
  } else {
    return (
      <div className="app__minimized-overlay">
        <span className="app__minimized-overlay__anchor"></span>
        <button className="app__minimized-overlay__expand" onClick={()=>{ctx.setFocus(WindowFocus.BOTH)}}>
          Expand
        </button>
      </div>
    )
  }
}

function focusClass(is: WindowFocus, current: WindowFocus) {
  if(is == current) {
    return "app__window--maximized";
  } else if(current == WindowFocus.BOTH) {
    return "app__window--both";
  } else {
    return "app__window--minimized";
  }
}