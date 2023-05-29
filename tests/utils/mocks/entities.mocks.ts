import { type Guardian } from '@/tests/utils/types'

interface Options {
  withId?: boolean
  withAccessToken?: boolean
  withForgetPassword?: boolean
  fields?: Partial<Guardian>
}

const makeFakeGuardianData = ({
  withId = false,
  withAccessToken = false,
  withForgetPassword = false,
  fields = {}
}: Options = {}): Guardian => {
  const fakeGuardian = {
    firstName: 'valid_first_name',
    lastName: 'valid_last_name',
    email: 'valid_email',
    password: 'valid_password',
    phone: 'valid_phone',
    accessToken: null,
    forgetPasswordToken: null
  }

  if (withId) {
    Object.assign(fakeGuardian, { id: 'valid_id' })
  }

  if (withAccessToken) {
    Object.assign(fakeGuardian, { accessToken: 'valid_token' })
  }

  if (withForgetPassword) {
    Object.assign(fakeGuardian, { forgetPasswordToken: 'valid_forget_password' })
  }

  if (fields) {
    Object.assign(fakeGuardian, fields)
  }

  return fakeGuardian
}

export {
  makeFakeGuardianData
}
