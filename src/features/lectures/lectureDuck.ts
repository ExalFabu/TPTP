import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IAppState } from '../../app/store';

export interface ILecture {
  _id: string;
  name: string;
  cfu: number | null;
  grade: number | null;
  lode: boolean;
  caratt: boolean;
  isRemoved: boolean;
  new_cfu: number | null;
}

export const createEmptyLecture = () =>
  ({
    _id: nanoid(),
    name: '',
    cfu: null,
    grade: null,
    lode: false,
    caratt: false,
    isRemoved: false,
    new_cfu: null,
  } as ILecture);

export const initialState: ILecture[] = [createEmptyLecture()];

const lectureSlice = createSlice({
  name: 'lectures',
  initialState,
  reducers: {
    addLecture: state => {
      state.push(createEmptyLecture());
    },
    editLecture: <T extends keyof ILecture>(
      state: ILecture[],
      action: PayloadAction<{
        id: string;
        key: T;
        value: ILecture[T];
      }>
    ) => {
      state.forEach(each => {
        if (each._id === action.payload.id)
          each[action.payload.key] = action.payload.value;
      });
    },
    removeLecture: (state, action: PayloadAction<string>) => {
      const filtered = state.filter(lec => lec._id !== action.payload);
      return filtered.length === 0 ? [createEmptyLecture()] : filtered;
    },
  },
});

export const { addLecture, editLecture, removeLecture } = lectureSlice.actions;

export default lectureSlice.reducer;

export const selectLectures = (state: IAppState) => {
  console.log(state);
  return state.lectures;
};
export const selectLectureById = (id: string) => (state: IAppState) =>
  state.lectures.filter(e => e._id === id)[0];
