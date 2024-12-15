import { useStorage } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import '@src/Popup.css';
import { useAtom } from 'jotai';
import type { ComponentPropsWithoutRef } from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import { FiPlusCircle } from 'react-icons/fi';
import { AddModalVisibleAtom } from '../atom';

const AddButton = (props: ComponentPropsWithoutRef<'button'>) => {
  const [_, setAddModalVisible] = useAtom(AddModalVisibleAtom);
  const theme = useStorage(exampleThemeStorage);
  return (
    <button
      className={
        props.className +
        ' ' +
        'font-bold mt-0 py-2 px-4 rounded shadow hover:scale-105 h-12' +
        (theme === 'light' ? 'bg-white text-black shadow-black' : 'bg-black text-white')
      }
      onClick={() => {
        setAddModalVisible(true);
      }}>
      {theme === 'light' ? <FiPlusCircle fontSize={20} /> : <AiFillPlusCircle fontSize={20} />}
    </button>
  );
};

export default AddButton;
