import {AuthEmailRequestType} from "@/components/user/SendAuthEmail.tsx";
import {authActions} from "@/store/auth/authSlice.ts";
import {
  CHANGE_PASSWORD_API_URL, FORGOT_PASSWORD_API_URL,
  LOGIN_API_URL, RESEND_EMAIL_VERIFICATION_API_URL,
  SIGNUP_API_URL,
  USER_API_URL,
  VERIFY_EMAIL_API_URL,
} from "@/constants/urls.ts";
import {AppDispatch} from "@/store/store.ts";
import {getCookie} from "@/utils/cookies.ts";
import {getErrors} from "@/utils/errors.ts";
import axios, {AxiosError} from "axios";

export interface AuthEmailInterface {
  email: string;
  requestType: AuthEmailRequestType;
}

export interface AuthEmailResponseInterface {
  success: boolean;
  message: string;
  errors: {
    data: {
      email: string;
    };
    message: string;
  };
}

export const InitialAuthEmailResponse: AuthEmailResponseInterface = {
  success: false,
  message: "",
  errors: {
    data: {
      email: "",
    },
    message: "",
  },
}

interface SignupInterface {
  email: string;
  password: string;
  confirmPassword?: string;
  isRememberMe: boolean;
}

export interface SignupResponseInterface {
  success: boolean;
  message: string;
  errors: {
    data: {
      email: string;
      password: string;
    };
    message: string;
  };
  isTokenValid: boolean;
}

export const InitialSignupResponse: SignupResponseInterface = {
  success: false,
  message: "",
  errors: {
    data: {
      email: "",
      password: "",
    },
    message: "",
  },
  isTokenValid: false,
}

interface ChangePasswordInterface {
  access: string,
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordResponseInterface {
  success: boolean;
  message: string;
  errors: {
    data: {
      password: string;
      confirmPassword: string;
    };
    message: string;
  };
  isTokenValid: boolean;
}

export const InitialChangePasswordResponse: ChangePasswordResponseInterface = {
  success: false,
  message: "",
  errors: {
    data: {
      password: "",
      confirmPassword: "",
    },
    message: "",
  },
  isTokenValid: false,
}

interface UpdateProfileInterface {
  access: string,
  username?: string,
  firstName: string,
  lastName: string,
}

export interface ProfileUpdateResponseInterface {
  success: boolean;
  message: string;
  errors: {
    data: {
      username: string;
      firstName: string;
      lastName: string;
    };
    message: string;
  };
  isTokenValid: boolean;
}

export const InitialProfileUpdateResponse: ProfileUpdateResponseInterface = {
  success: false,
  message: "",
  errors: {
    data: {
      username: "",
      firstName: "",
      lastName: "",
    },
    message: "",
  },
  isTokenValid: false,
}

export const sendAuthEmail = ({email, requestType}: AuthEmailInterface) => {
  return async (dispatch: AppDispatch): Promise<AuthEmailResponseInterface> => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
    }

    const response = InitialAuthEmailResponse;

    try {
      dispatch(authActions.setAuthLoading(true));
      const params = {email: email};
      const apiUrl = requestType === "resend_email_verification" ? RESEND_EMAIL_VERIFICATION_API_URL
        : requestType === "forgot_password" ? FORGOT_PASSWORD_API_URL : "";

      await axios.post(apiUrl, params,{headers: headers});
      response.success = true;
    } catch (error) {
      const errors = getErrors({error: error as AxiosError});
      response.errors.data.email = errors.data?.email?.[0] ?? "";
      response.errors.message = errors.message ?? "";
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
};

export const auth = ({email, password, confirmPassword, isRememberMe}: SignupInterface) => {
  return async (dispatch: AppDispatch): Promise<SignupResponseInterface> => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
    }

    const response = InitialSignupResponse;

    try {
      dispatch(authActions.setAuthLoading(true));
      const params: Record<string, string> = {
        email: email,
        ...(!confirmPassword && { password: password }),
        ...(confirmPassword && { password1: password, password2: confirmPassword }),
      };
      const apiUrl = confirmPassword ? SIGNUP_API_URL : LOGIN_API_URL;
      const result = await axios.post(apiUrl, params,{headers: headers});

      // Save the user data after login.
      if (!confirmPassword) {
        dispatch(authActions.setUserData(result.data));
        dispatch(authActions.setRememberMe(isRememberMe));
      }
      response.success = true;
      response.isTokenValid = true;
    } catch (error) {
      const errors = getErrors({error: error as AxiosError});
      response.isTokenValid = errors.isTokenValid;
      response.errors.data.email = errors.data?.email?.[0] ?? "";
      response.errors.data.password = errors.data?.password1?.[0] ?? "";
      response.errors.message = errors.message ?? "";
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
};

export const changePassword = ({access, password, confirmPassword}: ChangePasswordInterface) => {
  return async (dispatch: AppDispatch): Promise<ChangePasswordResponseInterface> => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access}`,
    }

    const response = InitialChangePasswordResponse;

    try {
      dispatch(authActions.setAuthLoading(true));

      const params: Record<string, string> = {new_password1: password, new_password2: confirmPassword,};
      await axios.post(CHANGE_PASSWORD_API_URL, params,{headers: headers});

      response.success = true;
      response.isTokenValid = true;
    } catch (error) {
      const errors = getErrors({error: error as AxiosError});

      response.isTokenValid = errors.isTokenValid;
      response.errors.data.password = errors.data?.new_password1?.[0] ?? "";
      response.errors.data.confirmPassword = errors.data?.new_password2?.[0] ?? "";
      response.errors.message = errors.message ?? "";
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
};

export const verifyEmail = ({key}: {key: string}) => {
  return async (dispatch: AppDispatch) => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
    }

    let response = false;

    try {
      dispatch(authActions.setAuthLoading(true));
      const params: Record<string, string> = {
        key: key,
      };
      await axios.post(VERIFY_EMAIL_API_URL, params,{headers: headers});
      response = true;
    } catch (error) {
      getErrors({error: error as AxiosError});
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
}

export const updateProfile = ({access, username, firstName, lastName}: UpdateProfileInterface) => {
  return async (dispatch: AppDispatch): Promise<ProfileUpdateResponseInterface> => {
    const headers = {
      'X-CSRFTOKEN': getCookie('csrftoken'),
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access}`,
    }

    const response = InitialProfileUpdateResponse;

    try {
      dispatch(authActions.setAuthLoading(true));
      const params: Record<string, string> = {
        first_name: firstName,
        last_name: lastName,
        ...(username && { username })
      };

      await axios.patch(USER_API_URL, params,{headers: headers});
      const result = await axios.get(USER_API_URL, {headers: headers});

      dispatch(authActions.setUserDetails(result.data));

      response.success = true;
      response.isTokenValid = true;
    } catch (error) {
      const errors = getErrors({error: error as AxiosError});
      response.success = false;
      response.isTokenValid = errors.isTokenValid;

      response.errors.data.username = errors.data?.username?.[0] ?? "";
      response.errors.data.firstName = errors.data?.first_name?.[0] ?? "";
      response.errors.data.lastName = errors.data?.last_name?.[0] ?? "";
      response.errors.message = errors.message ?? "";
    } finally {
      dispatch(authActions.setAuthLoading(false));
    }
    return response;
  };
};
