interface TagSelectorProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  tagOptions: string[];
}

const TagSelector = ({ tags, setTags, tagOptions }: TagSelectorProps) => {
  const toggleTag = (tagOption: string) => {
    if (tags.includes(tagOption)) {
      setTags((prev) => prev.filter((t) => t !== tagOption));
      return;
    }
    setTags((prev) => [...prev, tagOption]);
  };

  return (
    <div id="tag-selector">
      {tagOptions.map((tagOption, index) => {
        const isSelected = tags.includes(tagOption);
        return (
          <div
            key={index}
            className={`card ${isSelected ? "selected" : ""}`}
            onClick={() => toggleTag(tagOption)}
          >
            {tagOption}
          </div>
        );
      })}
    </div>
  );
};

export default TagSelector;
