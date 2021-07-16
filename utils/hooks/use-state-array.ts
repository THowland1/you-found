import React from 'react';

export function useStateArray<T>(
  initalState: T[],
  onChange: (value: T[]) => any = () => {}
): [
  T[],
  (newItem: T) => void,
  (index: number, newValue: T) => void,
  (index: number) => void,
  React.Dispatch<T[]>
] {
  const [items, _setItems] = React.useState(initalState);
  function setItems(value: T[]) {
    _setItems(value);
    onChange(value);
  }

  function addItem(newItem: T) {
    setItems([...items, newItem]);
  }

  function updateItem(index: number, newValue: T) {
    const newItems = [...items];
    newItems[index] = newValue;
    setItems(newItems);
  }
  function removeItem(index: number) {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  }

  return [items, addItem, updateItem, removeItem, setItems];
}
