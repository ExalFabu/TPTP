import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAppState, store } from '../../app/store';
import { ILecture, selectLectures } from '../lectures/lectureSlice';
import { selectPreferences } from '../preferences/preferencesSlice';

export interface IAverage {
  isInCorso: boolean;
  hasDoneErasmus: boolean;
}

export const createInitialAverage = () =>
  ({ isInCorso: false, hasDoneErasmus: false } as IAverage);

const averageSlice = createSlice({
  name: 'options',
  initialState: createInitialAverage,
  reducers: {
    toggleInCorso: average => {
      average.isInCorso = !average.isInCorso;
    },
    toggleErasmus: average => {
      average.hasDoneErasmus = !average.hasDoneErasmus;
    },
  },
});

export default averageSlice.reducer;

export const { toggleErasmus, toggleInCorso } = averageSlice.actions;

interface IValidLecture extends ILecture {
  cfu: number;
  grade: number;
}

export const selectOptions = (state: IAppState) => state.options;

const _selectAverageAndRemovedLectures = createSelector(
  selectLectures,
  selectPreferences,
  (
    lectures,
    preferences
  ): { average: number; removedLectures: IValidLecture[] } => {
    const isValid = (lecture: ILecture): lecture is IValidLecture =>
      lecture.grade !== 0 &&
      lecture.grade !== null &&
      lecture.grade !== undefined &&
      lecture.grade >= 18 &&
      lecture.grade <= 30 &&
      lecture.cfu !== 0 &&
      lecture.cfu !== null &&
      lecture.cfu !== undefined &&
      lecture.cfu > 0;

    let [weights, sum, removedCFUsCount] = [0, 0, 0];
    const validLectures = lectures.filter(isValid);
    validLectures.forEach(element => {
      weights += element.cfu;
      sum += element.grade * element.cfu;
    });
    let avg = Math.round((sum / weights) * 100) / 100;

    // Successivamente la ordino in ordine di voto, così da rimuovere quelle con voto minore prima.
    let removableLectures = validLectures.filter(el => el.caratt === false);

    removableLectures.sort((a, b) => a.grade - b.grade); // sort from the worst grade up

    let upper_bound = (index: number) => {
      if (preferences.removeCFU) {
        return (
          removedCFUsCount < preferences.cfu_value &&
          index < removableLectures.length
        );
      } else {
        return (
          index < Math.min(preferences.mat_value, removableLectures.length)
        );
      }
    };
    for (let i = 0; upper_bound(i); i++) {
      // Mi prendo le materie non caratterizzanti con voti minori della media calcolata
      // (Così che, la rimozione, non può che migliorare la media)
      avg = Math.round((sum / weights) * 100) / 100;
      if (removableLectures[i].grade >= avg || isNaN(avg)) {
        break;
      }
      // Rimuovo la materia con il voto più basso
      sum -= removableLectures[i].grade * removableLectures[i].cfu;
      weights -= removableLectures[i].cfu;

      let newCFU = 0;

      // Se devo rimuovere in base ai cfu
      //    controllo che non sforo i CFU da levare (preferences.removeCFU),
      //    in caso la ricalcolo con il peso giusto
      // Se devo rimuovere in base al numero di materie non devo ripesare nulla
      if (
        preferences.removeCFU &&
        removableLectures[i].cfu + removedCFUsCount > preferences.cfu_value
      ) {
        newCFU =
          removableLectures[i].cfu + removedCFUsCount - preferences.cfu_value;
        sum += removableLectures[i].grade * newCFU;
        weights += newCFU;
      }
      removedCFUsCount += removableLectures[i].cfu;
      removableLectures[i] = {
        ...removableLectures[i],
        new_cfu: newCFU,
        isRemoved: newCFU !== removableLectures[i].cfu,
      };
    }
    // TODO: dopo aver calcolato dovrei aggiornare le lectures per quelle rimosse... vedrò meglio come dopo
    avg = Math.round((sum / weights) * 100) / 100;
    return {
      average: isNaN(avg) ? 0 : avg,
      removedLectures: removableLectures.filter(l => l.isRemoved),
    };
  }
);

export const selectAverage = createSelector(_selectAverageAndRemovedLectures, (average) => average.average)
export const selectRemovedLectures = createSelector(_selectAverageAndRemovedLectures, (removed) => removed.removedLectures)

export const selectFinalGrade = createSelector(
  selectAverage,
  selectLectures,
  selectPreferences,
  selectOptions,
  (average, lectures, preferences, options): number => {
    const countOfLode = lectures.reduce(
      (prev, curr) => prev + (curr.lode && curr.grade === 30 ? 1 : 0),
      0
    );
    const bonusLode = Math.min(countOfLode, 6) * preferences.ptlode;
    const votoDiBase = (average * 11) / 3;
    const bonusDiProfitto = preferences.averageBonus
      .filter(
        bonus =>
          (bonus.from < average && average < bonus.to) || average === bonus.eq
      )
      ?.at(0)?.value;
    const votoFinale =
      votoDiBase +
      ((options.hasDoneErasmus && preferences.erasmus) || 0) +
      ((options.isInCorso && preferences.incorso) || 0) +
      (bonusDiProfitto ?? 0) +
      bonusLode;
    // TODO: aggiungere bonus di profitto
    return Math.round(votoFinale * 100) / 100;
  }
);
