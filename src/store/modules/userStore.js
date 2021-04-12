import Axios from 'axios';
import router from '@/router/index';
import ActionUtilities from '@/store/utilities/actions';
import GetterUtilities from '@/store/utilities/getters';
import MutationUtilities from '@/store/utilities/mutations';

const baseUrl = `${process.env.VUE_APP_ROOT_API}/account/users`;

const actions = {
  Authenticate: (context, payload) => new Promise((resolve, reject) => {
    context.commit('SetLoading', true);
    const request = {
      url: `${baseUrl}/authenticate`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: payload,
    };
    Axios(request)
      .then((response) => {
        context.commit('SetUser', response.data.result.signedInUser.email);
        context.commit('SetToken', response.data.result.token);
        context.commit('SetIsSignedIn', true);
        router.push({ name: 'Admin' });
        resolve();
      })
      .catch((error) => {
        context.commit('SetErrorMessage', error.response.data.message);
        context.commit('SetHasError', true);
        reject();
      })
      .finally(() => {
        context.commit('SetLoading', false);
      });
  }),
  CreateUser: (context, payload) => new Promise((resolve, reject) => {
    const options = {
      actionVerb: 'post',
      actionUrl: `${baseUrl}/create`,
      context,
      dataPayload: payload,
      loadAction: 'LoadUsers',
      loadingMutation: 'SetLoading',
      resolve,
      reject,
    };
    ActionUtilities.reloadAffectingAction(options);
  }),
  LoadUsers: (context) => new Promise((resolve, reject) => {
    context.commit('SetLoading', true);
    context.commit('SetData', null);
    const request = {
      url: `${process.env.VUE_APP_ROOT_API}/users/getusers`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    Axios(request)
      .then((response) => {
        context.commit('SetData', response.data.result);
        context.commit('SetRole', response.data.result.find((r) => r.email === context.state.user).role);
        resolve();
      })
      .catch(() => {
        reject();
      })
      .finally(() => {
        context.commit('SetLoading', false);
      });
  }),
  SignOut: (context) => new Promise((resolve, reject) => {
    context.commit('SetLoading', true);
    const request = {
      url: `${baseUrl}/signout`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    Axios(request)
      .then(() => {
        context.commit('SetUser', null);
        context.commit('SetIsSignedIn', false);
        router.push({ name: 'Home' });
        resolve();
      })
      .catch(() => {
        context.commit('SetErrorMessage', 'Could not sign out');
        context.commit('SetHasError', true);
        reject();
      })
      .finally(() => {
        context.commit('SetLoading', false);
      });
  }),
  DeleteUsers: (context, payload) => new Promise((resolve, reject) => {
    ActionUtilities.reloadAffectingAction({
      actionVerb: 'delete',
      actionUrl: `${process.env.VUE_APP_ROOT_API}/users/delete/${payload.id}`,
      context,
      loadAction: 'LoadUsers',
      loadingMutation: 'SetLoading',
      reject,
      resolve,
    });
  }),
};
const getters = {
  Data: GetterUtilities.get('data'),
  ErrorMessage: GetterUtilities.get('errorMessage'),
  IsSignedIn: GetterUtilities.get('isSignedIn'),
  HasError: GetterUtilities.get('hasError'),
  Loading: GetterUtilities.get('loading'),
  User: GetterUtilities.get('user'),
  Token: GetterUtilities.get('token'),
  Role: GetterUtilities.get('role'),
};
const mutations = {
  SetData: MutationUtilities.set('data'),
  SetErrorMessage: MutationUtilities.set('errorMessage'),
  SetIsSignedIn: MutationUtilities.set('isSignedIn'),
  SetHasError: MutationUtilities.set('hasError'),
  SetLoading: MutationUtilities.set('loading'),
  SetUser: MutationUtilities.set('user'),
  SetToken: MutationUtilities.set('token'),
  SetRole: MutationUtilities.set('role'),
};
const state = {
  data: null,
  errorMessage: null,
  isSignedIn: false,
  hasError: false,
  loading: false,
  user: null,
  token: null,
  role: null,
};
export default {
  actions,
  getters,
  mutations,
  state,
};
