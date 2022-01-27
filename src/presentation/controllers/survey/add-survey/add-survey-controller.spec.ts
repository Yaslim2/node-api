import { HttpRequest, Validation } from './add-survey-protocols'
import { AddSurveyController } from './add-survey-controller'
const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any-question',
    answers: [{
      image: 'any-image',
      answer: 'any-answer'
    }]
  }
})

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    class ValidationStub implements Validation {
      validate (input: any): Error {
        return null
      }
    }
    const validationStub = new ValidationStub()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const sut = new AddSurveyController(validationStub)
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
