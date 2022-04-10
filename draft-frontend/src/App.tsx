import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Context } from 'vm';
import './App.css';
import { Editor, EditorContext } from './editor/editor';
import { EditorTarget } from './fanfic/editortarget';
import { Fanfic } from './fanfic/fanfiction';
import { Preview, PreviewContext } from './preview/preview';
import { ServerContext } from './topmenu/serverconnect';
import { TopMenu } from './topmenu/topmenu';

export enum WindowFocus {
  EDITOR_ONLY,
  BOTH,
  PREVIEW_ONLY
}

export interface ModalDialogInnerProps extends React.HTMLProps<HTMLDivElement> {
  ctx: AppContext;
}

export interface RetargetCapability {
  retarget(target: EditorTarget): void;
}

export interface ModalCapability {
  setModal(dialog: ((props: ModalDialogInnerProps)=>JSX.Element)|undefined): void;
}

export interface SetDirtyCapability {
  setDirty(): void;
}

export class AppContext implements RetargetCapability, ModalCapability {
  private focus: WindowFocus = WindowFocus.BOTH;

  target: EditorTarget = EditorTarget.targetFic();

  editor: EditorContext = new EditorContext();
  preview: PreviewContext = new PreviewContext();
  fic: FanficContext = new FanficContext();
  server: ServerContext = new ServerContext(this, this.fic);

  dialog: ((props: ModalDialogInnerProps)=>JSX.Element)|undefined = undefined;

  constructor () {
    makeAutoObservable(this);
  }
  
  setModal(dialog: ((props: ModalDialogInnerProps) => JSX.Element) | undefined): void {
    this.dialog = dialog;
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

export class FanficContext implements SetDirtyCapability {
  fic: Fanfic|undefined = undefined;
  dirty: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setDirty(): void {
    this.dirty = true;
  }

  switchStory(name: string, serverCtx: ServerContext): void {
    if(name == "") {
      //save current
      this.fic = undefined;
    }
    serverCtx.readFic(name, "latest").then(val=>{
      if(val instanceof Fanfic) {
        //TODO: Save current
        this.fic = val;
      }
    });
  }
}

let ctx: AppContext = new AppContext();

export const App = observer(()=>{
  if(ctx.dialog === undefined) {
    return (
      <div className="app">
        <TopMenu ctx={ctx}/>
        <AppInner/>
      </div>
    );
  } else {
    return (
    <React.Fragment>
      <div className="app--hidden">
          <TopMenu ctx={ctx}/>
          <AppInner/>
          <div className="app__modal-dialog">
              <ctx.dialog ctx={ctx}/>
          </div>
      </div>
    </React.Fragment>
    )
  }
});

export const AppInner = observer(()=>{
  if(ctx.fic.fic === undefined) {
    return (<div className="app__nofic">
      <span className="app__nofic__anchor"></span>
      <span className="app__nofic__showtext">No fanfiction to display. Please log in to a server and select a story to edit</span>    
    </div>);
  } else {
    return (
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
    );
  }
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