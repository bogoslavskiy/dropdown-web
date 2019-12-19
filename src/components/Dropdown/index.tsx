import * as React from 'react';
import './Dropdown.css';

export type option = {
  label: string;
  value: string;
}

interface DropdownProps {
  options: option[];
  onChange?: (option: option) => void;
  onChangeMultiselect?: (option: option[]) => void;
  selected?: option;
  selectedList?: option[];
  searchable?: boolean;
  multiselect?: boolean;
  placeholder?: string;
  notFoundText?: string;
}

export const Dropdown = (props: DropdownProps) => {
  const { 
    options, 
    searchable, 
    selected = null, 
    onChange = () => {}, 
    onChangeMultiselect = () => {},
    selectedList = []
  } = props;
  const [isFocused, setIsFocused] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState<number>(0);
  const [inputValue, setInputValue] = React.useState(selected ? selected.label : '');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const optionsRef = React.useRef<HTMLDivElement>(null);

  const resultOptions = React.useMemo(() => {
    const reg = new RegExp(inputValue, 'i');
    if(!props.multiselect && inputValue === selected?.label) {
      return options;
    }

    if (searchable && !props.multiselect) {
      return options.filter((option) => option.value.match(reg));
    }

    if (props.multiselect) {
      return options.filter((option) => {
        const isSelected = selectedList.find((opt) => opt.value === option.value);
        return (searchable ? option.value.match(reg) : true) && !isSelected;
      });
    } 

    return options;
  }, [inputValue, searchable, selected, options, selectedList, props.multiselect])

  const handleChooseItem = React.useCallback((option: option) => {
    onChange(option);
    
    if (props.multiselect) {
      onChangeMultiselect([...selectedList, option]);
      setInputValue('');
    } else {
      setInputValue(option.label);
    }

    if (inputRef.current) {
      inputRef.current.blur();
    }
  }, [onChange, onChangeMultiselect, props.multiselect, selectedList]);

  const setFocusOnOption = React.useCallback((direction: 'previous' | 'next') => {
    if (!resultOptions.length) {
      return;
    }

    let nextFocus = focusedIndex;
    const lastIndex = resultOptions.length - 1;

    if (direction === 'next') {
      nextFocus = focusedIndex > 0 ? focusedIndex - 1 : lastIndex;
    } else if (direction === 'previous') {
      nextFocus = focusedIndex < lastIndex ? focusedIndex + 1 : 0;
    }

    setFocusedIndex(nextFocus);
  }, [focusedIndex, resultOptions]);

  const handleInputFocus = React.useCallback(() => {
    const focusedIndex = resultOptions.findIndex((option) => option.value === selected?.value);
    setFocusedIndex(focusedIndex !== -1 ? focusedIndex : 0);
    setIsFocused(true);
  }, [resultOptions, selected]);

  const handleInputBlur = React.useCallback(() => {
    if (optionsRef.current && optionsRef.current.contains(document.activeElement)) {
      if (inputRef.current) {
        inputRef.current.focus();
        return;
      }
    }

    setIsFocused(false);
  }, []);

  const handleKeyDown = React.useCallback((ev: React.KeyboardEvent) => {
    ev.stopPropagation();

    switch (ev.key) {
      case 'Escape': 
        if (inputRef.current) {
          inputRef.current.blur();
        } 
        break;
      case 'ArrowUp':
        setFocusOnOption('next');
        break;
      case 'ArrowDown':
        setFocusOnOption('previous');
        break;
      case 'Enter':
        if (resultOptions[focusedIndex]) {
          handleChooseItem(resultOptions[focusedIndex]);
        }
        break;
    }
  }, [focusedIndex, resultOptions, setFocusOnOption, handleChooseItem]);

  const handleChangeInputText = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    const text = ev.target.value;
    setInputValue(text);
  }, []);  

  const removeOption = React.useCallback((option: option) => {
    const selectedOptions = selectedList.filter((opt) => opt.value !== option.value);
    onChangeMultiselect(selectedOptions);
  }, [selectedList, onChangeMultiselect]);

  return (
    <>
      <div onKeyDown={handleKeyDown}  className="dropdown dropdown-wrapper">
        <div style={{ width: '100%' }}>
          <div className="flex dropdown-input--wrapper">
            <input 
              className="dropdown-input"
              ref={inputRef}
              type={'text'} 
              placeholder={props.placeholder} 
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              value={inputValue}
              readOnly={!searchable}
              onChange={handleChangeInputText}
            />
            <div className="flex dropdown-arrow" style={{ transform: isFocused ? 'rotate(90deg)' : 'rotate(-90deg)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#a)"><path fillRule="evenodd" clipRule="evenodd" d="M16.207 2.793a1 1 0 0 1 0 1.414L8.414 12l7.793 7.793a1 1 0 0 1-1.414 1.414l-8.5-8.5a1 1 0 0 1 0-1.414l8.5-8.5a1 1 0 0 1 1.414 0z" fill="#000"></path></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h24v24H0z"></path></clipPath></defs></svg>
            </div>
          </div>
          {isFocused && (
            <div ref={optionsRef} className="dropdown-options dropdown-options-wraper">
              {resultOptions.map((option, key) => (
                <div 
                  key={key} 
                  className="dropdown-options--item" 
                  style={{ backgroundColor: focusedIndex === key ? '#F2F3F5' : '#fff'}} 
                  onClick={() => handleChooseItem(option)} 
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  {option.label}
                </div>
              ))}
              {resultOptions.length < 1 && searchable && (
                <div className="dropdown-noresults">
                  {props.notFoundText || 'Not found'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {props.multiselect && (
        <div className="flex dropdown-wrapper dropdown-selected-list">
          {selectedList.map((option, key) => (
            <div key={key} className="flex dropdown-selected-list--item">
              <span style={{ fontSize: 14 }}>{option.label}</span>
              <div className="flex close-icon" onClick={() => removeOption(option)}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="#FFF" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M2.97 2.97a.75.75 0 0 1 1.06 0L8 6.94l3.97-3.97a.75.75 0 1 1 1.06 1.06L9.06 8l3.97 3.97a.75.75 0 1 1-1.06 1.06L8 9.06l-3.97 3.97a.75.75 0 0 1-1.06-1.06L6.94 8 2.97 4.03a.75.75 0 0 1 0-1.06z" fill="#FFF"></path></svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
} 