import { FC } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import clsx from "clsx";

interface ItemType {
  id: string;
  text: string;
}

interface PropsType {
  options: Array<ItemType>;
  selected: ItemType;
  callback: (val: ItemType) => void;
}

const PageListBox: FC<PropsType> = ({ options, selected, callback }) => {
  return (
    <div className="w-full">
      <Listbox value={selected} onChange={callback}>
        <ListboxButton
          className={clsx(
            "relative block w-full rounded-lg bg-white/5 py-2 pr-8 pl-3 text-left text-black-common border border-gray-border text-sm font-semibold",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 group"
          )}
        >
          {selected.text}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="rotate-180 group-data-[open]:rotate-0 transition duration-100 pointer-events-none absolute top-2.5 right-2.5 size-4 fill-black/60"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 15.75 7.5-7.5 7.5 7.5"
            />
          </svg>
        </ListboxButton>
        <Transition
          enter="transform transition duration-100 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transform transition duration-75 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <ListboxOptions
            anchor="bottom"
            className={clsx(
              "w-[var(--button-width)] rounded-xl border bg-white p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none border-gray-border"
              // 'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
            )}
          >
            {options.map((item) => (
              <ListboxOption
                key={item.id}
                value={item}
                className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-gray/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="invisible size-4 fill-white group-data-[selected]:visible"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
                <div className="text-sm/6 text-black-common">{item.text}</div>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </Listbox>
    </div>
  );
};

export default PageListBox;
