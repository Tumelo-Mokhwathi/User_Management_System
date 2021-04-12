import GetterUtilities from '@/store/utilities/getters';

const getters = {
  Dictionary: GetterUtilities.getArrayAsDictionary('list', 'value'),
  List: GetterUtilities.getArrayCopy('list'),
  SystemRoles: GetterUtilities.getObjectCopy('systemRoles'),
};

const ROLE_ADMINISTRATOR = 'Administrator';
const ROLE_BASE = 'Base';
const ROLE_SUPER_ADMINISTRATOR = 'SuperAdministrator';

const state = {
  list: [
    {
      allowedToCreateRoles: [
        ROLE_ADMINISTRATOR,
        ROLE_BASE,
      ],
      display: 'Administrator',
      value: ROLE_ADMINISTRATOR,
    },
    {
      allowedToCreateRoles: [],
      display: 'Base',
      value: ROLE_BASE,
    },
    {
      allowedToCreateRoles: [
        ROLE_ADMINISTRATOR,
        ROLE_BASE,
        ROLE_SUPER_ADMINISTRATOR,
      ],
      display: 'Super Administrator',
      value: ROLE_SUPER_ADMINISTRATOR,
    },
  ],
  systemRoles: {
    Admin: ROLE_ADMINISTRATOR,
    Base: ROLE_BASE,
    SuperAdministrator: ROLE_SUPER_ADMINISTRATOR,
  },

};

export default {
  getters,
  state,
};
