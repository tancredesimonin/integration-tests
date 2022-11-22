export const extractEmailParams = (htmlContent:string) => {

  return  htmlContent.match(/\{\{params\.[[A-Z]*/g)
}

export const extractEmailParamsName = (emailParamsArray: string[] | null): string[] | null => {
  if (emailParamsArray === null || emailParamsArray.length < 1) {
    return null;
  }
  const myParamsArray: string[] = [];
  for (const param of emailParamsArray) {
    let trimmed = param.substring('{{params.'.length);
    trimmed = trimmed.replace('\"','');
    if (!myParamsArray.includes(trimmed)) {
      myParamsArray.push(trimmed)
    }
  }
  return myParamsArray;
}

export const validateEmailParams = (paramsFromBody: { [key: string]: string; }, emailParamsArray: string[]) => {
  const validParams = [];
  const invalidParams = [];
  let success: boolean = true;
  for (const paramName of emailParamsArray) {
    const hasProperty = paramsFromBody.hasOwnProperty(paramName);
     const hasValue = paramsFromBody[paramName] !== null && paramsFromBody[paramName] !== undefined;

    if (hasProperty && hasValue) {
      validParams.push(paramName);

    }
    if (!hasProperty || !hasValue) {
      invalidParams.push(paramName)
    }
  }
  if (invalidParams.length > 0) { success = false }
  return { success, validParams, invalidParams }
}


export const extractPathFromUrl = (url: string) : string => {
    const splittedUrl = url.split('/');
    return  splittedUrl[splittedUrl.length -1]
}