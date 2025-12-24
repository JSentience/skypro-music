'use client';

import { data } from '@/data';
import classNames from 'classnames';
import { useState } from 'react';
import styles from './Filter.module.css';

export default function Filter() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState({
    author: '',
    year: '',
    genre: '',
  });
  const authorFilter = [...new Set(data.map((track) => track.author))].filter(
    Boolean,
  );
  const yearFilter = [
    ...new Set(data.map((track) => track.release_date.slice(0, 4))),
  ].filter(Boolean);
  const genreFilter = [...new Set(data.flatMap((track) => track.genre))].filter(
    Boolean,
  );
  const filters = [
    { name: 'author', label: 'исполнителю', options: authorFilter },
    { name: 'genre', label: 'жанру', options: genreFilter },
    { name: 'year', label: 'году выпуска', options: yearFilter },
  ];

  const handleFilterClick = (filterName: string) => {
    setActiveFilter(activeFilter === filterName ? null : filterName);
  };

  const handleOptionChange = (filterName: string, value: string) => {
    setSelectedFilter({
      ...selectedFilter,
      [filterName]: value,
    });
    // Закрываем список после выбора
    setActiveFilter(null);
  };

  return (
    <div className={styles.centerblock__filter}>
      <div className={styles.filter__title}>Искать по:</div>
      {filters.map((filter) => (
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
                        selectedFilter[
                          filter.name as keyof typeof selectedFilter
                        ] === option,
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
