<template>
  <b-container fluid class="mt-5 pt-5">
    <b-row class="mb-3">
      <h3 class="col-12 col-md-8">Identity Users</h3>
      <b-col class="text-right" cols="12" md="4">
        <b-button
          variant="primary"
          class="ml-3"
          @click="setupModifyModal(formStates.create, null)"
          v-if="isAllowedToCreateUsers"
        >
          Create User
        </b-button>
      </b-col>
    </b-row>
    <grid :fields="fields" :isBusy="Loading" :values="Users" :tableId="'TableId1'">
      <template #cell(disabled)="row">
         <grid-row-status :disabled="row.item.disabled" />
      </template>
      <template v-slot:cell(actions)="row" v-if="isAllowedToCreateUsers">
      <b-button-group size="sm">
        <b-button
          @click="DeleteUsers(row.item)"
          variant="outline-danger"
        >
          <b-icon-trash />
        </b-button>
      </b-button-group>
    </template>
    </grid>
    <validation-observer v-slot="{ handleSubmit, invalid }">
    <form-modal
      :action-button-text="formState.actionButtonText"
      :action-button-variant="formState.actionButtonVariant"
      :cancel-button-text="formState.cancelButtonText"
      @closed="closeModal"
      :disable-submit="Loading || invalid"
      :heading-text="formState.headingText"
      :loading="Loading"
      :modal-id="modifyModalId"
      :notification-message="notification.message"
      :notification-type="notification.type"
      @submitted="handleSubmit(submit)"
    >
      <p v-if="formStates.delete === formState">
        Are you sure you want to delete "{{ localPayload.email }}"?
      </p>
      <p v-else-if="formStates.toggleStatus === formState">
        {{ payloadToggleStatusText }}
      </p>
      <slot v-else-if="[formStates.create, formStates.edit].includes(formState)">
        <b-form-group>
          <validation-provider
            v-slot="{ errors }"
            rules="required"
          >
            <float-label>
              <b-form-input
                name="name"
                placeholder="Name"
                type="text"
                v-model="payload.name"
              />
            </float-label>
            <validation-error-label :error="errors[0]" />
          </validation-provider>
        </b-form-group>
         <b-form-group>
          <validation-provider
            v-slot="{ errors }"
            rules="required"
          >
            <float-label>
              <b-form-input
                name="surname"
                placeholder="Surname"
                type="text"
                v-model="payload.surname"
              />
            </float-label>
            <validation-error-label :error="errors[0]" />
          </validation-provider>
        </b-form-group>
         <b-form-group>
          <validation-provider
            v-slot="{ errors }"
            rules="required|email"
          >
            <float-label>
              <b-form-input
                name="email"
                placeholder="Email"
                type="email"
                v-model="payload.email"
              />
            </float-label>
            <validation-error-label :error="errors[0]" />
          </validation-provider>
        </b-form-group>
        <b-form-group>
          <validation-provider
            v-slot="{ errors }"
            rules="required|contactNo"
          >
            <float-label>
              <b-form-input
                name="contactNo"
                placeholder="Contact Number"
                type="text"
                v-model="payload.phoneNumber"
              />
            </float-label>
            <validation-error-label :error="errors[0]" />
          </validation-provider>
        </b-form-group>
        <b-form-group>
          <validation-provider
            v-slot="{ errors }"
            rules="required|password"
          >
            <float-label>
              <b-form-input
                name="password"
                placeholder="Password"
                type="password"
                v-model="payload.password"
              />
            </float-label>
            <validation-error-label :error="errors[0]" />
          </validation-provider>
        </b-form-group>
        <b-form-group>
          <validation-provider
            v-slot="{ errors }"
            rules="required|password"
          >
            <float-label>
              <b-form-input
                name="confirmPassword"
                placeholder="Confirm Password"
                type="password"
                v-model="payload.confirmPassword"
              />
            </float-label>
            <validation-error-label :error="errors[0]" />
          </validation-provider>
        </b-form-group>
        <b-form-group>
            <validation-provider v-slot="{ errors }" rules="required">
              <float-label :dispatch="false" label="Role">
                <b-form-select
                  :options="allowedRoles"
                  v-model="payload.role"
                  name="role"
                >
                  <template v-slot:first>
                    <option disabled selected :value="null">-- Select Role --</option>
                  </template>
                </b-form-select>
              </float-label>
              <validation-error-label :error="errors[0]" />
            </validation-provider>
          </b-form-group>
      </slot>
    </form-modal>
  </validation-observer>
  </b-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import GridRowStatus from '@/components/shared/GridRowStatus.vue';
import Grid from '@/components/shared/Grid.vue';
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate';

import { email, required } from 'vee-validate/dist/rules';

import FloatLabel from 'vue-float-label/components/FloatLabel.vue';
import FormModal from '@/components/shared/FormModal.vue';
import ValidationErrorLabel from '@/components/shared/ValidationErrorLabel.vue';

extend('email', {
  ...email,
  message: 'Email address invalid',
});
extend('password', {
  validate: (value) => {
    const passwordString = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    return !!passwordString.test(value);
  },
  message: 'The password must at leastcontant: 1 uppercase letter, 1 lowercase letter, 1 number, and one special character',
});
extend('required', {
  ...required,
  message: 'This field is required',
});

extend('contactNo', {
  validate: (value) => {
    const phoneNumber = /^((\+27)|0)(\d{2})-?(\d{3})-?(\d{4}|\d{8})$/;
    return !!phoneNumber.test(value);
  },
  message: 'Phone number is invalid',
});

export default {
  components: {
    Grid,
    GridRowStatus,
    FloatLabel,
    FormModal,
    ValidationErrorLabel,
    ValidationObserver,
    ValidationProvider,
  },
  computed: {
    ...mapGetters({
      Loading: 'userStore/Loading',
      Users: 'userStore/Data',
      SystemRoles: 'rolesStore/SystemRoles',
      RolesDictionary: 'rolesStore/Dictionary',
      RolesList: 'rolesStore/List',
      Role: 'userStore/Role',
    }),
    allowedRoles() {
      if (!this.Role) {
        return [];
      }
      const allowedRoleValues = this.RolesDictionary[this.Role].allowedToCreateRoles;
      return this.RolesList
        .filter((r) => allowedRoleValues.some((arv) => arv === r.value))
        .map((r) => ({
          text: r.display,
          value: r.value,
        }));
    },
    emptyPayload: () => ({
      email: '',
      name: '',
      surname: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      role: null,
    }),
    fields() {
      return [
        {
          key: 'name',
          label: 'Name',
          sortable: true,
        },
        {
          key: 'surname',
          label: 'Surname',
          sortable: true,
        },
        {
          key: 'email',
          label: 'Email',
          sortable: true,
        },
        {
          key: 'contactNo',
          label: 'Contact No.',
          sortable: true,
        },
        {
          key: 'disabled',
          label: 'Disabled',
          sortable: true,
        },
        {
          key: 'role',
          label: 'Role',
          sortable: true,
        },
        {
          key: 'actions',
          label: 'Actions',
          sortable: false,
        },
      ];
    },
    formStates() {
      return {
        create: {
          actionButtonText: 'Create',
          actionButtonVariant: 'primary',
          cancelButtonText: 'Cancel',
          headingText: 'Create',
          submitMethod: this.CreateUser,
        },
      };
    },
    isAllowedToCreateUsers() {
      return this.Role === this.SystemRoles.SuperAdministrator;
    },
    modifyModalId() {
      return `modifyModal-${Math.random()}`;
    },
    UsersList() {
      if (!this.Users || this.Users.length < 1) {
        return [];
      }

      return this.Users;
    },
  },
  created() {
    this.formState = this.formStates.create;
  },
  data() {
    return {
      formState: null,
      notification: {
        message: '',
        type: 'alert-danger',
      },
      payload: {},
    };
  },
  methods: {
    ...mapActions({
      CreateUser: 'userStore/CreateUser',
      DeleteUsers: 'userStore/DeleteUsers',
      LoadUsers: 'userStore/LoadUsers',
    }),
    closeModal() {
      this.notification.message = '';
      this.$bvModal.hide(this.modifyModalId);
    },
    setupModifyModal(formState, payload) {
      if (!payload) {
        this.payload = { ...this.emptyPayload };
      } else {
        this.payload = { ...payload };
      }
      this.formState = formState;
      this.$bvModal.show(this.modifyModalId);
    },
    submit() {
      this.notification.message = '';
      this.formState.submitMethod(this.payload)
        .then(() => {
          this.$bvModal.hide(this.modifyModalId);
        })
        .catch((error) => {
          if (!error) {
            this.notification.message = 'An error occurred';
            return;
          }

          const message = (error
            && error.response
            && error.response.data
            && error.response.data.message)
            ? error.response.data.message
            : error.toString();
          this.notification.message = message;
        });
    },
  },
  mounted() {
    this.LoadUsers();
    console.log(this.Role);
  },
};
</script>
