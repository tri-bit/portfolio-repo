import { useState } from 'react';
import { textToVariableName } from '../srcClient/clientUtils';
import { defaultInputCharacterLimit, defaultTextAreaCharacterLimit } from '../srcClient/config';
import MHAInput from './MHAInput';
import MHAButton from './MHAButton';
import MHAJSON from './MHAJSON';
import { MHAFormMessage } from './Elements';
import AnimWrap from './AnimWrap';

const MHAForm = (props) => {

  const {
    inputs,
    initialValues,
    message,
    handleSubmit,
    requiredAsterisk,
    validationCallback,
    submitLabel,
    submitStyling,
    submitIcon,
    handleFormUpdate,
    handleFormUpdateStoragePrepped,
    showDebug,
    captureEnterKey,
    submitTestId,
    divider,
    showPasswords,
  } = props;

  const showSubmit =
    props.showSubmit !== null && props.showSubmit !== 'undefined'
      ? props.showSubmit
      : true;

  const labeledInputCount = inputs.filter((input) => {
    const { type } = input;
    return type === 'labeledinput' || type === 'labeledinputnumber';
  }).length;

  const unifiedLabelSize = labeledInputCount > 1;

  const [validationErrors, setValidationErrors] = useState(null);

  const transformLabelName = props.transformLabelName || true;

  const getDataLabel = (label) => {
    return transformLabelName ? textToVariableName(label) : label;
  };

  const createTypeMap = () => {
    const typeMap = {};

    inputs.forEach((input) => {
      const { label, type } = input;
      typeMap[getDataLabel(label)] = type;
    });

    return typeMap;
  };

  const handleInputUpdate = ({ label, value, type }) => {
    // console.log('form input change', { label, value, type });
    const update = { ...formData, [getDataLabel(label)]: value };
    if (handleFormUpdate) {
      handleFormUpdate(update);
    }
    if (handleFormUpdateStoragePrepped) {
      handleFormUpdateStoragePrepped(prepDataForStorage({ data: update }));
    }

    setFormData(update);
  };



  const formSubmit = () => {
    if (!validationCheck()) {
      return;
    }

    console.log({ formData });

    const preppedData = prepDataForStorage({ data: formData });

    console.log({ preppedData });

    handleSubmit(preppedData);
  };

  const handleKeyPress = (e) => {
    if (captureEnterKey && e.key === 'Enter') {
      console.log('Enter key pressed!', formData);
      formSubmit();
    }
  };

  const prepDataForStorage = ({ data }) => {
    const preppedData = {};

    const typeMap = createTypeMap();

    // console.log({ typeMap });

    for (const [key, value] of Object.entries(data)) {
      const type = typeMap[key];

      preppedData[key] = prepInputValueForStorage({ type, value });
    }

    return preppedData;
  };

  const prepDataForUsage = ({ data }) => {
    const preppedData = {};

    const typeMap = createTypeMap();

    for (const [key, value] of Object.entries(data)) {
      const type = typeMap[key];

      preppedData[key] = prepInputValueForUsage({ type, value });
    }

    return preppedData;
  };

  const prepInputValueForUsage = ({ type, value }) => {
    // console.log('prep for usage', { type, value });

    switch (type) {
      case 'texteditor':
        return value ? JSON.parse(value) : undefined;

      case 'datetimepicker':
        if (value === 'NaN') {
          return undefined;
        }
        return value;

      default:
        return value;
    }
  };

  const prepInputValueForStorage = ({ type, value }) => {
    // console.log('prep for storage', { type, value });

    switch (type) {
      case 'texteditor':
        return JSON.stringify(value);

      default:
        return value;
    }
  };

  const [formData, setFormData] = useState(
    (initialValues && prepDataForUsage({ data: initialValues })) || {}
  );

  const getRequiredErrorMessage = ({ input }) => {
    if (input?.type === 'dropdown') {
      return input?.requiredMessage || 'Please select option below';
    }

    return input?.requiredMessage || 'Field cannot be blank';
  };

  const validationCheck = () => {
    const errors = {};
    let errorFound = false;

    console.log('validation check');
    inputs.forEach((input) => {
      const { label, type, requiredLength } = input;
      const value = formData ? formData[getDataLabel(label)] : null;

      const characterCount = String(value).trim().length;

      let characterLimit = input?.characterLimit;

      if (!characterLimit) {
        characterLimit =
          type === 'textarea'
            ? defaultTextAreaCharacterLimit
            : defaultInputCharacterLimit;
      }

      const characterCountExceeded =
        type === 'textarea' && characterCount > parseInt(characterLimit);

      if ((input.required && !value) || value === '') {
        errors[getDataLabel(label)] = getRequiredErrorMessage({ input });
        errorFound = true;
      } else if (
        requiredLength &&
        characterCount !== parseInt(requiredLength)
      ) {
        errors[
          getDataLabel(label)
        ] = `Does not meet required length: ${requiredLength} digits`;
        errorFound = true;
      } else if (characterCountExceeded) {
        errors[
          getDataLabel(label)
        ] = `Character count exceeds maximum: ${characterLimit} digits`;
        errorFound = true;
      }

      if (type === 'numberrange') {
        if (!value || value === '0,0' || value.trim().split(',').length <= 1) {
          errors[getDataLabel(label)] = `Please fill in all values`;
          errorFound = true;
        } else if (value.split(',').length > 1) {
          const [min, max] = value.split(',');
          if (parseFloat(min) >= parseFloat(max)) {
            errors[
              getDataLabel(label)
            ] = `Min cannot be larger or equal to Max`;
            errorFound = true;
          }
        }
      }
    });

    if (errorFound) {
      setValidationErrors({
        message: 'Please Correct The Issues Below',
        errors,
      });
    }

    if (!errorFound) {
      setValidationErrors(null);
    }

    return !errorFound;
  };

  // save validation function for use by parent
  if (validationCallback) {
    validationCallback(validationCheck);
  }

  const renderForm = () => {
    const validationMessage =
      (validationErrors && validationErrors.message) || null;
    const errors = (validationErrors && validationErrors.errors) || {};

    return (
      <>
        {!handleSubmit && <div>!MHAForm Missing handleSubmit</div>}
        {!inputs && <div>!MHAForm Missing Inputs</div>}

        {validationMessage && (
          <>
            <AnimWrap>
              <div className="mha__form error" style={{ textAlign: 'center' }}>
                {validationMessage}
              </div>
            </AnimWrap>
          </>
        )}

        {inputs &&
          inputs.map((input, index) => {
            const {
              label,
              type,
              options,
              defaultOption,
              publicLabel,
              testId,
              description,
              placeholder,
              characterLimit,
              hide,
              jsx,
              required,
              requiredMessage,
              requiredLength,
            } = input;

            return (
              <React.Fragment key={`mhaFormInput_${index}`}>
                <MHAInput
                  {...{
                    label,
                    type,
                    publicLabel,
                    options,
                    defaultOption,
                    testId,
                    description,
                    placeholder,
                    characterLimit,
                    hide,
                    jsx,
                    required,
                    requiredMessage,
                    requiredLength,
                    requiredAsterisk,
                    validationError: errors[getDataLabel(label)],
                    value: formData ? formData[getDataLabel(label)] : '',
                    handleUpdate: handleInputUpdate,
                    showPasswords,
                  }}
                />
              </React.Fragment>
            );
          })}
      </>
    );
  };

  return (
    <>
      <div className="mha__formWrap">
        <div
          title="mhaform"
          className={(unifiedLabelSize && ' mha__unifiedLabelSize') || ''}
          onKeyPress={handleKeyPress}
          role="button"
          tabIndex={0}
        >
          {message && (
            <>
              <div style={{ textAlign: 'center' }}>
                <MHAFormMessage type={message.type} text={message.text} />
              </div>
            </>
          )}

          {renderForm()}
          {divider}
          {showSubmit !== false && (
            <MHAButton
              icon={submitIcon}
              styling={submitStyling}
              onClick={formSubmit}
              testId={submitTestId || 'submitButton'}
              label={submitLabel || 'Submit'}
            />
          )}
          {showDebug && (
            <>
              <MHAJSON
                previewTitle="FormData"
                sourceObject={{ formData, initialValues }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MHAForm;
