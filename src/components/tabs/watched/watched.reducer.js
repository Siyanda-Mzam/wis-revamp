import { includes, filter } from 'lodash';

import itemExists from '../../../helpers/arraysUtility';
import createAction from '../../../helpers/actionCreator';
import { navigationTabsActions } from '../navigationTabs.reducer';

const initialState = {
  searchQuery: '',
  isFetchingItems: false,
  watchedItems: [],
  filteredWatchedItems: []
};

const watchedActionTypes = {
  SET_WATCHED_ITEM_NAME: 'SET_WATCHED_ITEM_NAME',
  SET_WATCHED_FOUND_ITEMS: 'SET_WATCHED_FOUND_ITEMS',
  SET_WATCHED_IS_FETCHED: 'SET_WATCHED_IS_FETCHED',
  SET_WATCHED_UNWATCH_ITEM: 'SET_WATCHED_UNWATCH_ITEM',
  SET_FILTERED_WATCHED_ITEMS: 'SET_FILTERED_WATCHED_ITEMS'
};

export const watchedActions = {
  setItemName: name =>
    createAction(watchedActionTypes.SET_WATCHED_ITEM_NAME, name),
  setWatchedProduct: product =>
    createAction(watchedActionTypes.SET_WATCHED_FOUND_ITEMS, product),
  setUnWatchProduct: product =>
    createAction(watchedActionTypes.SET_WATCHED_UNWATCH_ITEM, product),
  setFilteredWatchedItems: match =>
    createAction(watchedActionTypes.SET_FILTERED_WATCHED_ITEMS, match),
  setIsFetching: predicate =>
    createAction(watchedActionTypes.SET_WATCHED_IS_FETCHED, predicate)
};

export const fetchWatchedItemsThunk = name => (dispatch, getState) => {
  const { watchedItems } = getState().watchedReducer;
  const itemsMatching = filter(watchedItems, item =>
    includes(item.productBrand.toLowerCase(), name.toLowerCase())
  );
  dispatch(watchedActions.setFilteredWatchedItems(itemsMatching));
};

export const setAndUpdateWatchedItemsThunk = element => (
  dispatch,
  getState
) => {
  const { watchedItems } = getState().watchedReducer;
  const itemIsWatched = itemExists(watchedItems, element);
  if (!itemIsWatched) {
    dispatch(watchedActions.setWatchedProduct(element));
    const { numberOfWatchedItems } = getState().navigationTabsReducer;
    if (numberOfWatchedItems < watchedItems.length)
      dispatch(
        navigationTabsActions.setNumberOfWatchedItems(watchedItems.length)
      );
  } else alert('Already Watching this item :)');
  return;
};

export const setUnWatchedAndUpdateWatchedItemsThunk = element => {
  return (dispatch, getState) => {
    dispatch(watchedActions.setUnWatchProduct(element));
    const { watchedItems } = getState().watchedReducer;
    dispatch(
      navigationTabsActions.setNumberOfWatchedItems(watchedItems.length)
    );
    return;
  };
};

export default function watchedReducer(state = initialState, action) {
  let newState = { ...state };
  switch (action.type) {
    case watchedActionTypes.SET_WATCHED_ITEM_NAME:
      return (newState = {
        ...newState,
        searchQuery: action.payload
      });
    case watchedActionTypes.SET_WATCHED_IS_FETCHED:
      return (newState = {
        ...newState,
        isFetchingItems: action.payload
      });
    case watchedActionTypes.SET_WATCHED_FOUND_ITEMS:
      const element = action.payload;
      element.isWatched = true;
      newState.watchedItems.push(element);
      return (newState = {
        ...newState,
        isFetchingItems: false
      });
    case watchedActionTypes.SET_WATCHED_UNWATCH_ITEM:
      action.payload.isWatched = false;
      const newPayload = newState.watchedItems.filter(
        item => item !== action.payload
      );
      return (newState = {
        ...newState,
        watchedItems: newPayload,
        filteredWatchedItems: newPayload
      });
    case watchedActionTypes.SET_FILTERED_WATCHED_ITEMS:
      return {
        ...state,
        filteredWatchedItems: action.payload
      };
    default:
      return state;
  }
}
