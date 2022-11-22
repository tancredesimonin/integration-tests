import {
  extractEmailParams,
  extractEmailParamsName,
  extractPathFromUrl,
  validateEmailParams
} from "@shared/utils/extractors";

describe('shared.extractors', () => {

  it('extractPathFromUrl - should return only the hash from a full URL', () => {
    const expected = '5b6107e91e1e74acc2d9187145a932349fa8988cdbb2396b3f3dcff7cabab05e';
    const content = 'http://localhost:3000/signup/email/confirm/5b6107e91e1e74acc2d9187145a932349fa8988cdbb2396b3f3dcff7cabab05e'
    const result = extractPathFromUrl(content)
    expect(result).toEqual(expected)
  })

  it('extractEmailParams - should return null if no params are matched', () => {
    const expected = null;
    const content = `Lorem ipsum dolor sit amet, consectetur adipiscing elit`
    const result = extractEmailParams(content)
    expect(result).toEqual(expected)
  })

  it('extractEmailParams - should return 1 param if 1 param is matched', () => {
    const expected = [ '{{params.URL' ];
    const content = `Lorem ipsum dolor sit amet, {{params.URL}} adipiscing elit`
    const result = extractEmailParams(content)
    expect(result).toEqual(expected)
  })

  it('extractEmailParams - should return 2 params if 2 params are matched', () => {
    const expected = [ '{{params.URL', '{{params.ORGANISATION_NAME' ];
    const content = `Lorem ipsum dolor sit amet, {{params.URL}} adipiscing {{params.ORGANISATION_NAME}} elit`
    const result = extractEmailParams(content)
    expect(result).toEqual(expected)
  })

  it('extractEmailParamsName - should return null if no params are matched', () => {
    const expected = null;
    const content = `Lorem ipsum dolor sit amet, adipiscing elit`
    const result = extractEmailParamsName(extractEmailParams(content))
    expect(result).toEqual(expected)
  })

  it('extractEmailParamsName - should return 1 param if 1 param is matched', () => {
    const expected = [ 'URL' ];
    const content = `Lorem ipsum dolor sit amet, {{params.URL}} adipiscing elit`
    const result = extractEmailParamsName(extractEmailParams(content))
    expect(result).toEqual(expected)
  })

  it('extractEmailParamsName - should return 2 params if 2 params are matched', () => {
    const expected = [ 'URL', 'NAME' ];
    const content = `Lorem ipsum dolor sit amet, {{params.URL}} adipiscing {{params.NAME}} elit`
    const result = extractEmailParamsName(extractEmailParams(content))
    expect(result).toEqual(expected)
  })

  it('extractEmailParams - should return 1 param if 1 param is found multiple times', () => {
    const expected = [ 'URL', 'NAME' ];
    const content = `Lorem ipsum dolor sit amet, {{params.URL}} adipiscing {{params.NAME}} elit {{params.URL}} sfdgsdfgdsg {{params.URL}}`
    const result = extractEmailParamsName(extractEmailParams(content))
    expect(result).toEqual(expected)
  })

  it('validateEmailParams - should return success:false if no params are matched', () => {
    const paramsFromBody = {
      badPropName: 'blabla'
    }
    const content = `Lorem ipsum dolor sit amet, {{params.URL}} adipiscing elit`
    const emailParamsArray = extractEmailParamsName(extractEmailParams(content))
    const {  success } = validateEmailParams(paramsFromBody, emailParamsArray as string[])
    expect(success).toEqual(false)
  })

  it('validateEmailParams - should return success:true if 1 param are matched', () => {
    const paramsFromBody = {
      URL: 'blabla'
    }
    const content = `Lorem ipsum dolor sit amet, {{params.URL}} adipiscing elit`
    const emailParamsArray = extractEmailParamsName(extractEmailParams(content))
    const {  success, validParams, invalidParams } = validateEmailParams(paramsFromBody, emailParamsArray as string[])
    expect(success).toEqual(true)
    expect(invalidParams).toHaveLength(0)
    expect(validParams).toHaveLength(1)
    expect(validParams[0]).toEqual('URL')
  })

  it('validateEmailParams - should return success:true if 2 params are matched', () => {
    const paramsFromBody = {
      URL: 'blabla',
      NAME: 'toto'
    }
    const content = `Lorem ipsum dolor  sit amet, {{params.URL}} adipiscing elit {{params.NAME}}`
    const emailParamsArray = extractEmailParamsName(extractEmailParams(content))
    const {  success, validParams, invalidParams } = validateEmailParams(paramsFromBody, emailParamsArray as string[])
    expect(success).toEqual(true)
    expect(invalidParams).toHaveLength(0)
    expect(validParams).toHaveLength(2)
    expect(validParams[0]).toEqual('URL')
    expect(validParams[1]).toEqual('NAME')
  })
  it('validateEmailParams - should return success:false if 2 params are not all matched', () => {
    const paramsFromBody = {
      URL: 'blabla',
      BAD: 'toto'
    }
    const content = `Lorem ipsum dolor {{params.NAME}} sit amet, {{params.URL}} adipiscing elit`
    const emailParamsArray = extractEmailParamsName(extractEmailParams(content))
    const {  success, validParams, invalidParams } = validateEmailParams(paramsFromBody, emailParamsArray as string[])
    expect(success).toEqual(false)
    expect(invalidParams).toHaveLength(1)
    expect(validParams).toHaveLength(1)
    expect(validParams[0]).toEqual('URL')
    expect(invalidParams[0]).toEqual('NAME')
  })


})