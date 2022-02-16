import './App.css';
import { Editor } from './editor';
import { Preview } from './preview';
import { TopMenu } from './topmenu';

function App() {
  return (
    <div className="app">
      <TopMenu/>
      <div className="app__main">
        <div className="app__left-div">
          <Editor/>
        </div>
        <div className="app__right-div">
          <Preview/>
        </div>
      </div>
    </div>
  );
}

export default App;
