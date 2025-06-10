import React from 'react';

interface TagProps {
  text: string;
  onRemove: () => void;
}

const Tag = ({ text, onRemove }: TagProps) => (
  <span className="text-sm bg-gray-700 text-white pl-3 py-1 w-fit rounded-full flex items-center">
    {text}
    <button onClick={onRemove} type="button" className="mx-2 hover:text-red-500">
      <img src="/images/x-white.svg" alt="close" className='h-[18px] w-[18px]' />
    </button>
  </span>
)

export default Tag;