import { useAtom } from 'jotai';
import localforage from 'localforage';
import React from 'react';
import { IoBan } from 'react-icons/io5';
import { MdOutlineDeleteForever, MdRestore } from 'react-icons/md';
import { ChangeCountAtom } from './atom';
import { FORAGE_KEY } from './constant';
import { RedirectItem } from './type';

const ITable = () => {
  const [changeCount, setChangeCount] = useAtom(ChangeCountAtom);
  const [redirectItems, setRedirectItems] = React.useState<RedirectItem[]>([]);

  const handleChangeCount = async () => {
    const value = await localforage.getItem(FORAGE_KEY);
    if (value === null) {
      await localforage.setItem(FORAGE_KEY, []);
      return;
    }
    const items = value as unknown as RedirectItem[];
    setRedirectItems(items);
  };

  const handleDeleteItem = async (item: RedirectItem) => {
    const newItems = redirectItems.filter(ele => ele.id !== item.id);
    const result = await localforage.setItem(FORAGE_KEY, newItems);
    if (result) {
      setChangeCount(changeCount + 1);
    }
  };

  const handleTogglePermitted = async (item: RedirectItem) => {
    const newItems = redirectItems.map<RedirectItem>(ele =>
      ele.id === item.id ? { ...item, permitted: !item.permitted } : ele,
    );
    const result = await localforage.setItem(FORAGE_KEY, newItems);
    if (result) {
      setChangeCount(changeCount + 1);
    }
  };

  React.useEffect(() => {
    handleChangeCount();

    return () => {};
  }, [changeCount]);

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th className="font-bold text-2xl">PageBlocked</th>
            <th className="font-bold text-2xl">RedirectTo</th>
            <th className="font-bold text-2xl">Actions</th>
          </tr>
        </thead>
        <tbody>
          {redirectItems.map(item => (
            <tr key={item.id}>
              <td>{item.pageBlocked}</td>
              <td>{item.redirectTo}</td>
              <td>
                <div className="flex justify-center items-center space-x-1">
                  <button onClick={() => handleDeleteItem(item)} className="btn btn-outline btn-error">
                    <MdOutlineDeleteForever fontSize={20} />
                  </button>
                  {item.permitted ? (
                    <button onClick={() => handleTogglePermitted(item)} className="btn btn-outline btn-ghost">
                      <IoBan fontSize={20} />
                    </button>
                  ) : (
                    <button onClick={() => handleTogglePermitted(item)} className="btn btn-outline btn-accent">
                      <MdRestore fontSize={20} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ITable;
