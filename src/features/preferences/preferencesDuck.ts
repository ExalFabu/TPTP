import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAppState } from '../../app/store';

export interface IAverageBonus {
  id: string;
  from: number;
  to: number;
  eq: number;
  label: string;
  value: number;
}

export interface IPreferences {
  mat_or_cfu: boolean;
  removeCFU: boolean;
  cfu_value: number;
  mat_value: number;
  ptlode: number;
  incorso: number;
  erasmus: number;
  averageBonus: IAverageBonus[];
}

export const createInitialPreferences = (): IPreferences => {
  const createInitialAverageBonus = () => {
    let averageBonus = [] as IAverageBonus[];
    for (let i = 29; i >= 18; i--) {
      let val = 0;
      if (i >= 28) val = 6;
      else if (i >= 27) val = 5;
      else if (i >= 26) val = 4;
      else if (i >= 24) val = 3;
      else if (i >= 22) val = 2;
      const GE = '\u2265';
      averageBonus.push({
        id: `avBonus${i}`,
        from: i,
        to: i + 1 === 30 ? 31 : i + 1,
        eq: i,
        label: `${i + 1 === 30 ? '' : `${i + 1}>`}M${GE}${i}`,
        value: val,
      });
    }
    return averageBonus;
  };
  return {
    removeCFU: true,
    cfu_value: 18,
    mat_value: 0,
    ptlode: 0.5,
    incorso: 2,
    erasmus: 1,
    averageBonus: createInitialAverageBonus(),
    mat_or_cfu: true,
  };
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: createInitialPreferences,
  reducers: {
    editPreference: <
      T extends keyof Omit<IPreferences, 'averageBonus'>,
      K extends Array<{ key: T; value: IPreferences[T] }>
    >(
      state: IPreferences,
      action: PayloadAction<
        | {
            key: T;
            value: IPreferences[T];
          }
        | K
      >
    ) => {
      if ('key' in action.payload) {
        state[action.payload.key] = action.payload.value;
      } else {
        action.payload.forEach(({ key, value }) => {
          state[key] = value;
        });
      }
    },
    editAverageBonus: <T extends keyof Pick<IAverageBonus, 'value'>>(
      preferences: IPreferences,
      action: PayloadAction<{
        id: string;
        key: T;
        value: IAverageBonus[T];
      }>
    ) => {
      preferences.averageBonus.forEach(item => {
        if (item.id === action.payload.id)
          item[action.payload.key] = action.payload.value;
      });
    },
  },
});

export default preferencesSlice.reducer;

export const { editPreference, editAverageBonus } = preferencesSlice.actions;

export const selectPreferences = (state: IAppState) => state.preferences;

export const selectAverageBonus = (state: IAppState) => state.preferences.averageBonus;