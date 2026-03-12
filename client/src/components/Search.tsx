import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {updateValue, triggerSearch} from "../app/slice/search.ts";
import {FC} from "react";

interface SProps {
  className: string
}

const Search: FC<SProps> = ({ className }) => {
  const search = useAppSelector((state) => state.search.value);
  const dispatch = useAppDispatch();

  return (
    <div className={`${className} relative rounded-md lg:w-96 lg:mx-12 mx-6`}>
      <input type="text" name="search"
             className="block w-full rounded-sm border-0 text-gray-light placeholder:text-gray-light text-base font-normal h-9 px-2.5 focus:outline-0"
             placeholder="Search"
             value={search}
             onChange={(e) => {dispatch(updateValue(e.target.value))}}
      />
      <div className="absolute inset-y-0 right-2.5 cursor-pointer flex items-center" onClick={() => {dispatch(triggerSearch())}}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
             className="size-6 text-gray-light text-base">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>
    </div>
  );
}

export default Search;