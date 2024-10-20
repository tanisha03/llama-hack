import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
// @ts-ignore
import { AppDispatch, RootState } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
