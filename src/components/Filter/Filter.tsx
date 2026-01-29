'use client';

import classNames from 'classnames';
import { useCallback, useState } from 'react';
import styles from './Filter.module.css';

type FilterName = 'author' | 'genre' | 'year';

type FilterOption = {
  name: FilterName;
  label: string;
  options: string[];
};

type SelectedFilter = {
  author: string;
  year: string;
  genre: string;
};

type FilterProps = {
  filters?: FilterOption[];
  selectedFilter?: SelectedFilter;
  onChange?: (filterName: FilterName, value: string) => void;
};

export default function Filter({
  filters,
  selectedFilter,
  onChange,
}: FilterProps) {
  const fallbackFilters: FilterOption[] = filters ?? [];
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [localSelectedFilter, setLocalSelectedFilter] =
    useState<SelectedFilter>({
      author: '',
      year: '',
      genre: '',
    });

  const currentSelectedFilter = selectedFilter ?? localSelectedFilter;

  const handleFilterClick = useCallback(
    (filterName: string) => {
      setActiveFilter(activeFilter === filterName ? null : filterName);
    },
    [activeFilter],
  );

  const handleOptionChange = useCallback(
    (filterName: FilterName, value: string) => {
      if (onChange) {
        onChange(filterName, value);
      } else {
        setLocalSelectedFilter((prev) => ({
          ...prev,
          [filterName]: value,
        }));
      }
      // Закрываем список после выбора
      setActiveFilter(null);
    },
    [onChange],
  );

  return (
    <div className={styles.centerblock__filter}>
      <div className={styles.filter__title}>Искать по:</div>
      {fallbackFilters.map((filter) => (
        <div key={filter.name} className={styles.filter__wrapper}>
          <button
            className={classNames(styles.filter__button, {
              [styles.active]: activeFilter === filter.name,
            })}
            onClick={() => handleFilterClick(filter.name)}
          >
            {filter.label}
          </button>
          {activeFilter === filter.name && (
            <div className={styles.filter__dropdown}>
              <ul className={styles.filter__list}>
                {filter.options.map((option) => (
                  <li
                    key={option}
                    className={classNames(styles.filter__item, {
                      [styles.filter__item_active]:
                        currentSelectedFilter[filter.name] === option,
                    })}
                    onClick={() => handleOptionChange(filter.name, option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
