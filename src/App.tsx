import { Editor } from './components/Editor';
import { Preview } from './components/Preview';

function App() {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* 左侧编辑器 */}
      <Editor />

      {/* 右侧预览区 */}
      <Preview />
    </div>
  );
}

export default App;
