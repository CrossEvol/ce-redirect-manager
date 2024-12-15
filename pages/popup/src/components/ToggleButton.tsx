import { useStorage } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import '@src/Popup.css';
import type { ComponentPropsWithoutRef } from 'react';
import { MdDarkMode, MdOutlineLightMode } from 'react-icons/md';

const ToggleButton = (props: ComponentPropsWithoutRef<'button'>) => {
  const theme = useStorage(exampleThemeStorage);
  return (
    <button
      className={
        props.className +
        ' ' +
        'font-bold mt-0 py-2 px-4 rounded shadow hover:scale-105 h-12' +
        (theme === 'light' ? 'bg-white text-black shadow-black' : 'bg-black text-white')
      }
      onClick={exampleThemeStorage.toggle}>
      {theme === 'light' ? <MdOutlineLightMode fontSize={20} /> : <MdDarkMode fontSize={20} />}
    </button>
  );
};

export default ToggleButton;
