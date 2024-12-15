import '@src/Popup.css';
import { useAtom } from 'jotai';
import localforage from 'localforage';
import { nanoid } from 'nanoid';
import React from 'react';
import { useForm } from 'react-hook-form';
import { AddModalVisibleAtom, ChangeCountAtom } from '../atom';
import { ADD_MODAL_ID, FORAGE_KEY } from '../constant';
import { RedirectItem } from '../type';

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

export default AddModal;
