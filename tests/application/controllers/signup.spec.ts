import { MissingParamError } from '../../../src/application/errors/missing-param-error'
import { InvalidParamError } from '../../../src/application/errors/invalid-param-error'
import { ServerError } from '../../../src/application/errors/server-error'
import { SignUpController } from '../../../src/application/controllers/signup'
import { type EmailValidator } from 'application/validation/email-validator'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('SignUp Controller', () => {
  it('Should return 400 if no firstName is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isProvicyPolicyAccepted: 'any_boolean'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('firstName'))
  })

  it('Should return 400 if no lastName is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isProvicyPolicyAccepted: 'any_boolean'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('lastName'))
  })

  it('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isProvicyPolicyAccepted: 'any_boolean'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        passwordConfirmation: 'any_password',
        isProvicyPolicyAccepted: 'any_boolean'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        isProvicyPolicyAccepted: 'any_boolean'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('Should return 400 if isProvicyPolicyAccepted is not provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('isProvicyPolicyAccepted'))
  })

  it('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'invalid_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isProvicyPolicyAccepted: 'any_boolean'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isProvicyPolicyAccepted: 'any_boolean'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should return 500 if EmailValidator throws', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        throw new Error()
      }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SignUpController(emailValidatorStub)
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isProvicyPolicyAccepted: 'any_boolean'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
