import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import '@src/Popup.css';
import type { ComponentPropsWithoutRef } from 'react';
import React from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import { FiPlusCircle } from 'react-icons/fi';
import { MdDarkMode, MdOutlineLightMode } from 'react-icons/md';
import ITable from './ITable';
import { useForm } from 'react-hook-form';
import localforage from 'localforage';
import { RedirectItem } from './type';
import { useAtom } from 'jotai';
import { AddModalVisibleAtom, ChangeCountAtom } from './atom';
import { FORAGE_KEY } from './constant';
import { nanoid } from 'nanoid';

const ADD_MODAL_ID = 'add_modal_id';

const notificationOptions = {
  type: 'basic',
  iconUrl: chrome.runtime.getURL('icon-34.png'),
  title: 'Injecting content script error',
  message: 'You cannot inject script here!',
} as const;

const Popup = () => {
  const theme = useStorage(exampleThemeStorage);
  const isLight = theme === 'light';
  const logo = isLight ? 'popup/logo_vertical.svg' : 'popup/logo_vertical_dark.svg';
  const goGithubSite = () =>
    chrome.tabs.create({ url: 'https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite' });

  const injectContentScript = async () => {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

    if (tab.url!.startsWith('about:') || tab.url!.startsWith('chrome:')) {
      chrome.notifications.create('inject-error', notificationOptions);
    }

    await chrome.scripting
      .executeScript({
        target: { tabId: tab.id! },
        files: ['/content-runtime/index.iife.js'],
      })
      .catch(err => {
        // Handling errors related to other paths
        if (err.message.includes('Cannot access a chrome:// URL')) {
          chrome.notifications.create('inject-error', notificationOptions);
        }
      });
  };

  return (
    <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}>
      <div className="">
        <header className={`App-header ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
          {/* <button onClick={goGithubSite}>
          <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
        </button> */}
          <div className="flex space-x-2 items-center justify-center">
            <AddButton />
            <h1 className="text-4xl font-bold text-orange-400 bg-gray-200 leading-normal">Redirect Manager</h1>
            <ToggleButton />
          </div>
          {/* <button
          className={
            'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
            (isLight ? 'bg-blue-200 text-black' : 'bg-gray-700 text-white')
          }
          onClick={injectContentScript}>
          Click to inject Content Script
        </button> */}
          <AddModal />
          <ITable />
        </header>
      </div>
    </div>
  );
};

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

type FormData = Omit<RedirectItem, 'permitted'>;

const AddModal = () => {
  const [addModalVisible, setAddModalVisible] = useAtom(AddModalVisibleAtom);
  const [changeCount, setChangeCOunt] = useAtom(ChangeCountAtom);
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      pageBlocked: 'https://www.baidu.com/',
      redirectTo: 'https://www.google.com/',
    },
  });
  const onSubmit = handleSubmit(async data => {
    const list = (await localforage.getItem(FORAGE_KEY)) as unknown as RedirectItem[];
    const result = await localforage.setItem(FORAGE_KEY, [...list, { ...data, id: nanoid() }]);
    if (result) {
      setChangeCOunt(changeCount + 1);
      setAddModalVisible(false);
    }
  });

  const handleConfirm = async () => {
    const list = (await localforage.getItem(FORAGE_KEY)) as unknown as RedirectItem[];
    const result = await localforage.setItem(FORAGE_KEY, [...list, { ...getValues(), id: nanoid() }]);
    if (result) {
      setChangeCOunt(changeCount + 1);
      setAddModalVisible(false);
    }
  };

  const handleClose = async () => {
    setAddModalVisible(false);
  };

  React.useEffect(() => {
    if (addModalVisible) {
      (document.getElementById(ADD_MODAL_ID) as unknown as any)!.showModal();
    }
    return () => {};
  }, [addModalVisible, setAddModalVisible]);

  return addModalVisible ? (
    <div>
      <dialog id={ADD_MODAL_ID} className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Add Modal</h3>
          <div className="modal-action ">
            <form method="dialog" /* onSubmit={onSubmit}  */ className="space-y-2">
              <label className="input input-bordered flex items-center gap-2 w-96 font-bold text-gray-500">
                PageBlocked
                <input
                  type="text"
                  {...register('pageBlocked')}
                  className="grow font-normal"
                  placeholder="https://www.baidu.com/"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2 w-96 font-bold text-gray-500">
                RedirectTo
                <input
                  type="text"
                  {...register('redirectTo')}
                  className="grow font-normal"
                  placeholder="https://www.google.com/"
                />
              </label>
              <div className="space-x-4">
                <button onClick={handleClose} className="btn btn-outline">
                  Close
                </button>
                <button onClick={handleConfirm} className="btn btn-outline btn-info">
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  ) : null;
};

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

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
