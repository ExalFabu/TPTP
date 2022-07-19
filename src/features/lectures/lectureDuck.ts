import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
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
    dangerouslySetAllLectures: (current, action: PayloadAction<ILecture[]>) => {
      return action.payload;
    },
    reorderLectures: (
      lectures,
      action: PayloadAction<{ start: number; end: number }>
    ) => {
      if (action.payload.start === action.payload.end) return;
      const [removed] = lectures.splice(action.payload.start, 1);
      lectures = lectures.splice(action.payload.end, 0, removed);
    },
  },
});

export const {
  addLecture,
  editLecture,
  removeLecture,
  dangerouslySetAllLectures,
  reorderLectures,
} = lectureSlice.actions;

export default lectureSlice.reducer;

export const selectLectures = (state: IAppState) => {
  return state.lectures;
};
export const selectLectureById = (id: string) => (state: IAppState) =>
  state.lectures.filter(e => e._id === id)[0];
