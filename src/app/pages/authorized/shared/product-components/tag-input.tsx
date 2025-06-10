import React, { useState } from 'react'
import Tag from './tag';

interface TagsInputProps {
    tags: string[];
    setTags: (tags: string[]) => void;
    errorMessage?: string;
}

const TagInput = ({ tags, setTags, errorMessage }: TagsInputProps) => {
    const [tagInputValue, setTagInputValue] = useState("");

    const handleTags = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && tagInputValue.trim() !== "") {
            e.preventDefault();
            setTags([...tags, tagInputValue.trim()]);
            setTagInputValue("");
        }
    };

    const removeTag = (indexToRemove: number) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="w-full">
            <label className="tracking-wide text-gray-400 text-xs text-medium bg-white relative px-1 top-[12px] left-3 w-auto">
                Add tags
            </label>
            <input
                onChange={handleTags}
                onKeyDown={handleKeyDown}
                value={tagInputValue}
                className="appearance-none block text-[14px] w-full text-gray-700 border rounded py-4 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                placeholder="eg. car"
            />
            <div className="flex flex-wrap w-full mt-4 space-x-2">
                {tags.map((tag, index) => (
                    <Tag key={index} onRemove={() => removeTag(index)} text={tag} />
                ))}
            </div>
            <p className="text-red-500 text-[10px] mt-1">{errorMessage}</p>
        </div>
    );
}

export default TagInput
