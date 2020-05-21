import {environment as env} from '../../../environments/environment';

export const API_URLS = {

  authenticationService: {
    LOGIN: `${env.BASE_URL}auth/token`,
    REGISTER: `${env.BASE_URL}auth/register`,
    FORGOT_PASSWORD_BASE_URL: `${env.BASE_URL}auth/reset?email=`,
    COMPLETE: `${env.BASE_URL}auth/complete-reset`,
    CHANGE_PASSWORD: `${env.BASE_URL}auth/change-password`
  },
  superAgentService: {
    GET_SUPERAGENT: `${env.BASE_URL2}`
  },

  providerService: {
    AIRTIME_PROVIDER: `${env.BASE_URL2}services/airtime`,
    DATA_BUNDLE_PROVIDER: `${env.BASE_URL2}services/databundle`
  },

  billersService: {
    GET_BILLERS: `${env.BASE_URL2}billers`
  },

  transactionService: {
    LOG_TRANSACTION: `${env.BASE_URL}transactions/log`,
    COMPLETE_TRANSACTION: `${env.BASE_URL}transactions/complete`,
    TRANSACTION_HISTORY: `${env.BASE_URL}transactions/history`
  },

  billerRequestPlans: {
    MULTICHOICE: `${env.BASE_URL2}services/multichoice`,
    EPINS: `${env.BASE_URL2}services/epin/bundles`
  },

  requestService: {
    AIRTIME_REQUEST: `${env.BASE_URL2}services/airtime/request`,
    DATA_REQUEST: `${env.BASE_URL2}services/databundle/request`,
    ELECTRICITY_REQUEST: `${env.BASE_URL2}services/electricity/request`,
    ELECTRICITY_VERIFICATION: `${env.BASE_URL2}services/namefinder/query`,
    EPIN_REQUEST: `${env.BASE_URL2}services/epin/request`,
    MULTICHOICE_REQUEST: `${env.BASE_URL2}services/multichoice/request`,
    NAME_REQUEST: `${env.BASE_URL2}services/namefinder/query`
  },

  profileServices: {
    UPDATE_PROFILE : `${env.BASE_URL}profile/update`
  }


};
