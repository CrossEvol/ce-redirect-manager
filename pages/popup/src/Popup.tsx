import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import '@src/Popup.css';
import AddButton from './components/AddButton';
import AddModal from './components/AddModal';
import ITable from './components/ITable';
import ToggleButton from './components/ToggleButton';

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';

  return (
    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}>
      <div className="">
        <header className={`App-header ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
          <div className="flex space-x-2 items-center justify-center">
            <AddButton />
            <h1 className="text-4xl font-bold text-orange-400 bg-gray-200 leading-normal">Redirect Manager</h1>
            <ToggleButton />
          </div>
          <AddModal />
          <ITable />
        </header>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
