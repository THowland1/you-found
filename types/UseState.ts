import React from 'react';

export type UseState<T> = [T, React.Dispatch<React.SetStateAction<T>>];
