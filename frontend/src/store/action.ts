import type { History } from 'history';
import type { AxiosInstance, AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { UserAuth, Offer, Comment, CommentAuth, FavoriteAuth, UserRegister, NewOffer } from '../types/types';
import { ApiRoute, AppRoute, HttpCode, UserType } from '../const';
import { Token, getCurrentDateString } from '../utils';
import { adaptCommentToClient, adaptDetailedOfferToClient, adaptOfferToClient } from '../adapters/adaptToClient';
import { ShortOfferDto } from '../dto/short-offer.dto';
import { LoggedUserDto } from '../dto/logged-user.dto';
import { DetailedOfferDto } from '../dto/detailed-offer.dto';
import { CommentDto } from '../dto/comment.dto';
import { adaptOfferToServer } from '../adapters/adaptToServer';

type Extra = {
  api: AxiosInstance;
  history: History;
};

export const Action = {
  FETCH_OFFERS: 'offers/fetch',
  FETCH_OFFER: 'offer/fetch',
  POST_OFFER: 'offer/post-offer',
  EDIT_OFFER: 'offer/edit-offer',
  DELETE_OFFER: 'offer/delete-offer',
  FETCH_FAVORITE_OFFERS: 'offers/fetch-favorite',
  FETCH_PREMIUM_OFFERS: 'offers/fetch-premium',
  FETCH_COMMENTS: 'offer/fetch-comments',
  POST_COMMENT: 'offer/post-comment',
  POST_FAVORITE: 'offer/post-favorite',
  DELETE_FAVORITE: 'offer/delete-favorite',
  LOGIN_USER: 'user/login',
  LOGOUT_USER: 'user/logout',
  FETCH_USER_STATUS: 'user/fetch-status',
  REGISTER_USER: 'user/register',
};

export const fetchOffers = createAsyncThunk<Offer[], undefined, { extra: Extra }>(
  Action.FETCH_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<ShortOfferDto[]>(ApiRoute.Offers);

    return data.map((offer) => adaptOfferToClient(offer));
  });

export const fetchFavoriteOffers = createAsyncThunk<Offer[], undefined, { extra: Extra }>(
  Action.FETCH_FAVORITE_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<ShortOfferDto[]>(ApiRoute.Favorite);

    return data.map((offer) => adaptOfferToClient(offer));
  });

export const fetchOffer = createAsyncThunk<Offer, Offer['id'], { extra: Extra }>(
  Action.FETCH_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;

    try {
      const { data } = await api.get<DetailedOfferDto>(`${ApiRoute.Offers}/${id}`);

      return adaptDetailedOfferToClient(data);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.NotFound) {
        history.push(AppRoute.NotFound);
      }

      return Promise.reject(error);
    }
  });

export const postOffer = createAsyncThunk<Offer, NewOffer, { extra: Extra }>(
  Action.POST_OFFER,
  async (newOffer, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<DetailedOfferDto>(ApiRoute.Offers, adaptOfferToServer(newOffer));
    history.push(`${AppRoute.Property}/${data.id}`);

    if (newOffer.previewImage) {
      const payload = new FormData();
      payload.append('preview', newOffer.previewImage);
      await api.post(`${ApiRoute.Offers}/${data.id}/preview`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    if (newOffer.images) {
      const payload = new FormData();
      newOffer.images.forEach((image) => payload.append('images[]', image));
      await api.post(`${ApiRoute.Offers}/${data.id}/images`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    return adaptDetailedOfferToClient(data);
  });

export const editOffer = createAsyncThunk<Offer, Offer, { extra: Extra }>(
  Action.EDIT_OFFER,
  async (offer, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.patch<DetailedOfferDto>(`${ApiRoute.Offers}/${offer.id}`, adaptOfferToServer(offer));
    history.push(`${AppRoute.Property}/${data.id}`);

    if (offer.previewImage.length > 0) {
      const payload = new FormData();
      payload.append('preview', offer.previewImage);
      await api.post(`${ApiRoute.Offers}/${data.id}/preview`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    if (offer.images && offer.images.length > 0) {
      const payload = new FormData();
      offer.images.forEach((image) => {
        if (image.length > 0) {
          return payload.append('images[]', image);
        }
      });
      await api.post(`${ApiRoute.Offers}/${data.id}/images`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    return adaptDetailedOfferToClient(data);
  });

export const deleteOffer = createAsyncThunk<void, string, { extra: Extra }>(
  Action.DELETE_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;
    await api.delete(`${ApiRoute.Offers}/${id}`);
    history.push(AppRoute.Root);
  });

export const fetchPremiumOffers = createAsyncThunk<Offer[], string, { extra: Extra }>(
  Action.FETCH_PREMIUM_OFFERS,
  async (cityName, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<ShortOfferDto[]>(`${ApiRoute.Premium}/${cityName}`);

    return data.map((offer) => adaptOfferToClient(offer));
  });

export const fetchComments = createAsyncThunk<Comment[], Offer['id'], { extra: Extra }>(
  Action.FETCH_COMMENTS,
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<CommentDto[]>(`${ApiRoute.Comments}/${id}`);

    return data.map((comment) => adaptCommentToClient(comment));
  });

export const fetchUserStatus = createAsyncThunk<UserAuth['email'], undefined, { extra: Extra }>(
  Action.FETCH_USER_STATUS,
  async (_, { extra }) => {
    const { api } = extra;

    try {
      const { data } = await api.get<LoggedUserDto>(ApiRoute.Login);

      return data.email;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.NoAuth) {
        Token.drop();
      }

      return Promise.reject(error);
    }
  });

export const loginUser = createAsyncThunk<UserAuth['email'], UserAuth, { extra: Extra }>(
  Action.LOGIN_USER,
  async ({ email, password }, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<LoggedUserDto>(ApiRoute.Login, { email, password });
    const { token } = data;

    Token.save(token);
    history.push(AppRoute.Root);

    return email;
  });

export const logoutUser = createAsyncThunk<void, undefined, { extra: Extra }>(
  Action.LOGOUT_USER,
  async (_, { extra }) => {
    const { api } = extra;
    await api.delete(ApiRoute.Logout);

    Token.drop();
  });

export const registerUser = createAsyncThunk<void, UserRegister, { extra: Extra }>(
  Action.REGISTER_USER,
  async ({ email, password, name, avatar, type }, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<{ email: string }>(ApiRoute.Register, {
      email,
      password,
      name,
      isPro: type === UserType.Pro
    });
    if (avatar) {
      const payload = new FormData();
      payload.append('avatar', avatar);
      await api.post(`/${data.email}${ApiRoute.Avatar}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    history.push(AppRoute.Login);
  });


export const postComment = createAsyncThunk<Comment, CommentAuth, { extra: Extra }>(
  Action.POST_COMMENT,
  async ({ id, comment, rating }, { extra }) => {
    const { api } = extra;
    const { data } = await api.post<Comment>(`${ApiRoute.Comments}/${id}`, { comment, rating, date: getCurrentDateString() });

    return data;
  });

export const postFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.POST_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    const { data } = await api.post<DetailedOfferDto>(
      `${ApiRoute.Favorite}/${id}/1`
    );

    return adaptDetailedOfferToClient(data);
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.NoAuth) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(error);
  }
});

export const deleteFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.DELETE_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    const { data } = await api.post<DetailedOfferDto>(
      `${ApiRoute.Favorite}/${id}/0`
    );

    return adaptDetailedOfferToClient(data);
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === HttpCode.NoAuth) {
      history.push(AppRoute.Login);
    }

    return Promise.reject(error);
  }
});
