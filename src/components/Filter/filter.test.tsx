import { fireEvent, render, screen } from '@testing-library/react';
import Filter from './Filter';

type FilterName = 'author' | 'genre' | 'year';

type FilterOption = {
  name: FilterName;
  label: string;
  options: string[];
};

const filters: FilterOption[] = [
  { name: 'author', label: 'исполнителю', options: ['A', 'B'] },
];

describe('Filter component', () => {
  it('должен отображать фильтры', () => {
    render(<Filter filters={filters} />);

    fireEvent.click(screen.getByText('исполнителю'));
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });
});
