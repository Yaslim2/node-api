import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToBeCompare')
}

describe('CompareFields Validation', () => {
  test('Should return an InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any-field',
      fieldToBeCompare: 'any-fieldd'
    })
    expect(error).toEqual(new InvalidParamError('fieldToBeCompare'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any-field',
      fieldToBeCompare: 'any-field'
    })
    expect(error).toBeFalsy()
  })
})
