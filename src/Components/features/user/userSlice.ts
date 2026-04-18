import {
  createAsyncThunk,
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { User } from '@/types';
import type { RootState } from '@store';

import { getAddress } from '@/components/services/apiGeocoding';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type FetchAddressResult = {
  position: Coordinates;
  address: string;
};

function getAddressLookupErrorMessage(error: unknown): string {
  if (
    typeof DOMException !== 'undefined' &&
    error instanceof DOMException &&
    error.name === 'NotAllowedError'
  ) {
    return 'Could not detect location. Please enter your address manually.';
  }

  if (
    typeof GeolocationPositionError !== 'undefined' &&
    error instanceof GeolocationPositionError
  ) {
    return 'Could not detect location. Please enter your address manually.';
  }

  if (error instanceof Error && error.message === 'Failed getting address') {
    return 'Could not look up your address right now. Enter it manually if needed.';
  }

  return 'There was a problem getting your address. Make sure to fill this field!';
}

function getPosition(): Promise<GeolocationPosition> {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export const fetchAddress = createAsyncThunk<
  FetchAddressResult,
  void,
  { rejectValue: string }
>(
  'user/fetchAddress',
  async function (_, thunkApi) {
    // 1) We get the user's geolocation position
    try {
      const positionObj = await getPosition();
      const position = {
        latitude: positionObj.coords.latitude,
        longitude: positionObj.coords.longitude,
      };

      // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
      const addressObj = await getAddress(position);
      const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

      // 3) Then we return an object with the data that we are interested in.
      // Payload of the FULFILLED state
      return { position, address };
    } catch (error) {
      return thunkApi.rejectWithValue(getAddressLookupErrorMessage(error));
    }
  }
);

type UserState = User;

const initialState: UserState = {
  username: '',
  status: 'idle',
  position: {},
  address: '',
  error: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateName(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchAddress.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.status = 'idle';
        state.error = '';
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload ??
          'There was a problem getting your address. Make sure to fill this field!';
      }),
});

export const { updateName } = userSlice.actions;

export default userSlice.reducer;

const selectUserState = (state: RootState) => state.user;

export const selectUsername = createSelector(
  [selectUserState],
  (userState) => userState.username
);

export const selectUserPosition = createSelector(
  [selectUserState],
  (userState) => userState.position
);

export const selectUserAddress = createSelector(
  [selectUserState],
  (userState) => userState.address
);

export const selectUserStatus = createSelector(
  [selectUserState],
  (userState) => userState.status
);

export const selectUserError = createSelector(
  [selectUserState],
  (userState) => userState.error
);
