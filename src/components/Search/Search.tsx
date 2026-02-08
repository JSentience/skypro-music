'use client';

import React, { useCallback, useState } from 'react';
import styles from './Search.module.css';

type SearchProps = {
  value?: string;
  onChange?: (value: string) => void;
};

export default function Search({ value, onChange }: SearchProps) {
  const [searchInput, setSearchInput] = useState('');
  const inputValue = value ?? searchInput;

  const onSearchInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = e.target.value;

      if (onChange) {
        onChange(nextValue);
        return;
      }

      setSearchInput(nextValue);
    },
    [onChange],
  );
  return (
    <div className={styles.centerblock__search}>
      <svg className={styles.search__svg}>
        <use xlinkHref="/img/icon/sprite.svg#icon-search"></use>
      </svg>
      <input
        className={styles.search__text}
        type="search"
        placeholder="Поиск"
        name="search"
        value={inputValue}
        onChange={onSearchInput}
      />
    </div>
  );
}
