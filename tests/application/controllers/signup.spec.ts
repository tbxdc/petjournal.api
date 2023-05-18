import { InvalidParamError, MissingParamError } from '@/application/errors'
import { SignUpController } from '@/application/controllers/signup'
import { type PhoneValidator, type EmailValidator, type NameValidator } from '@/application/validation/protocols'
import { type AddGuardian } from '@/domain/use-cases/add-guardian'
import { type PasswordValidator } from '@/application/validation/protocols/password-validator'
import { badRequest, type HttpRequest, serverError, create } from '@/application/helpers/http'

const makeNameValidator = (): NameValidator => {
  class NameValidatorStub implements NameValidator {
    isValid (name: string): boolean {
      return true
    }
  }
  return new NameValidatorStub()
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makePhoneValidator = (): PhoneValidator => {
  class PhoneValidatorStub implements PhoneValidator {
    isValid (phone: string): boolean {
      return true
    }
  }
  return new PhoneValidatorStub()
}

const makePasswordValidator = (): PasswordValidator => {
  class PasswordValidatorStub implements PasswordValidator {
    isValid (phone: string): boolean {
      return true
    }
  }
  return new PasswordValidatorStub()
}

const makeAddGuardian = (): AddGuardian => {
  class AddGuardianStub implements AddGuardian {
    async add (guardian: AddGuardian.Params): Promise<AddGuardian.Result> {
      return {
        id: 1,
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone'
      }
    }
  }
  return new AddGuardianStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    firstName: 'any_first_name',
    lastName: 'any_last_name',
    email: 'any_email@mail.com',
    phone: 'any_phone',
    password: 'any_password',
    passwordConfirmation: 'any_password',
    isPrivacyPolicyAccepted: true
  }
})

interface SutTypes {
  sut: SignUpController
  addGuardianStub: AddGuardian
  emailValidatorStub: EmailValidator
  nameValidatorStub: NameValidator
  passwordValidatorStub: PasswordValidator
  phoneValidatorStub: PhoneValidator
}

const makeSut = (): SutTypes => {
  const addGuardianStub = makeAddGuardian()
  const emailValidatorStub = makeEmailValidator()
  const nameValidatorStub = makeNameValidator()
  const passwordValidatorStub = makePasswordValidator()
  const phoneValidatorStub = makePhoneValidator()
  const sut = new SignUpController(addGuardianStub, emailValidatorStub, nameValidatorStub, passwordValidatorStub, phoneValidatorStub)
  return { sut, addGuardianStub, emailValidatorStub, nameValidatorStub, passwordValidatorStub, phoneValidatorStub }
}

describe('SignUp Controller', () => {
  it('Should return 400 if no firstName is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isPrivacyPolicyAccepted: true
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('firstName')))
  })

  it('Should return 400 if no lastName is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isPrivacyPolicyAccepted: true
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('lastName')))
  })

  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isPrivacyPolicyAccepted: true
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        passwordConfirmation: 'any_password',
        isPrivacyPolicyAccepted: true
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('Should return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        isPrivacyPolicyAccepted: true
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  it('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
        isPrivacyPolicyAccepted: true
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  it('Should return 400 if isPrivacyPolicyAccepted is not provided', async () => {
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
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('isPrivacyPolicyAccepted')))
  })

  it('Should return 400 if isPrivacyPolicyAccepted is false', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isPrivacyPolicyAccepted: false
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('isPrivacyPolicyAccepted')))
  })

  it('Should return 400 if an invalid name is provided', async () => {
    const { sut, nameValidatorStub } = makeSut()
    jest.spyOn(nameValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        firstName: 'invalid_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isPrivacyPolicyAccepted: true
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('name')))
  })

  it('Should call NameValidator with correct name', async () => {
    const { sut, nameValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(nameValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_first_name', 'any_last_name')
  })

  it('Should return 500 if NameValidator throws', async () => {
    const { sut, nameValidatorStub } = makeSut()
    jest.spyOn(nameValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 400 if an invalid email is provided', async () => {
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
        isPrivacyPolicyAccepted: true
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 400 if an invalid phone is provided', async () => {
    const { sut, phoneValidatorStub } = makeSut()
    jest.spyOn(phoneValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        firstName: 'invalid_first_name',
        lastName: 'any_last_name',
        email: 'invalid_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isPrivacyPolicyAccepted: true
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('phone')))
  })

  it('Should call PhoneValidator with correct phone', async () => {
    const { sut, phoneValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(phoneValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_phone')
  })

  it('Should return 500 if PhoneValidator throws', async () => {
    const { sut, phoneValidatorStub } = makeSut()
    jest.spyOn(phoneValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 400 if an invalid password is provided', async () => {
    const { sut, passwordValidatorStub } = makeSut()
    jest.spyOn(passwordValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        firstName: 'invalid_first_name',
        lastName: 'any_last_name',
        email: 'invalid_email@mail.com',
        phone: 'any_phone',
        password: 'any_password',
        passwordConfirmation: 'any_password',
        isPrivacyPolicyAccepted: true
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('password')))
  })

  it('Should call PasswordValidator with correct password', async () => {
    const { sut, passwordValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(passwordValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_password')
  })

  it('Should return 500 if PasswordValidator throws', async () => {
    const { sut, passwordValidatorStub } = makeSut()
    jest.spyOn(passwordValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 500 if AddGuardian throws', async () => {
    const { sut, addGuardianStub } = makeSut()
    jest.spyOn(addGuardianStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => { reject(new Error()) })
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should call AddGuardian with correct values', async () => {
    const { sut, addGuardianStub } = makeSut()
    const addGuardianSpy = jest.spyOn(addGuardianStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addGuardianSpy).toHaveBeenCalledWith({
      firstName: 'any_first_name',
      lastName: 'any_last_name',
      email: 'any_email@mail.com',
      phone: 'any_phone',
      password: 'any_password'
    })
  })

  it('Should return 201 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        firstName: 'valid_first_name',
        lastName: 'valid_last_name',
        email: 'valid_email@mail.com',
        phone: 'valid_phone',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
        isPrivacyPolicyAccepted: true
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(create({
      id: 1,
      firstName: 'any_first_name',
      lastName: 'any_last_name',
      email: 'any_email@mail.com',
      phone: 'any_phone'
    }))
  })
})
