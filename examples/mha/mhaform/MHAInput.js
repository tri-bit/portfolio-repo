import NumberFormat from 'react-number-format'; // decimal formating, etc
import {
  Input,
  InputGroup,
  Dropdown,
  Form,
  FormControl,
  ButtonGroup,
} from 'react-bootstrap';
import { defaultTextAreaCharacterLimit } from '../srcClient/config';
import { FormDivider2, Asterisk } from './Elements';
import MHAPicker from './MHAPicker';
import MHATextEditor from './MHATextEditor';

const MHAInput = (props) => {
  const {
    handleUpdate,
    label,
    value,
    testId,
    description,
    placeholder,
    publicLabel,
    options,
    validationError,
    jsx,
    required,
    requiredAsterisk,
    showPasswords,
  } = props;

  const type = props.type || 'text';

  const largeLabel = ![
    'labeledinput',
    'labeledinputnumber',
    'switch',
    'subheader',
    'jsxinsert',
    'divider',
  ].includes(type);

  const dataTestId = testId || label;

  const characterLimit = props.characterLimit || defaultTextAreaCharacterLimit;

  if (!label) {
    return <>input !label</>;
  }

  const handleChange = (value) => {
    // add any reformatting, etc here
    // console.log('handleChange', { label, value });
    handleUpdate({ label, value });
  };

  const handleCombinedChange = (newValue, index, initialValue) => {
    const previousValue = value || initialValue;

    const splitValues = previousValue.split(',');
    splitValues[index] = newValue;
    handleUpdate({ label, value: splitValues.join(',') });
  };

  const renderCharacterLimit = () => {
    return (
      <div>
        {value?.length || 0} of maxiumum {characterLimit} characters.
      </div>
    );
  };

  const renderStandardInput = ({ inputType }) => {
    return (
      <>
        <input
          className="form-control"
          data-testid={dataTestId}
          aria-labelledby={label}
          aria-label={label}
          type={inputType}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
        />
      </>
    );
  };

  const renderTextVerification = () => {
    return (
      <>
        <div
          className="d-flex flex-row justify-content align-items-center"
          style={{ maxWidth: '100%', position: 'relative' }}
        >
          <strong>
            <h2 className="mha__verificationPrefix mr-2">M-</h2>
          </strong>
          <input
            style={{ maxWidth: '180px' }}
            className="form-control"
            data-testid={dataTestId}
            aria-labelledby={label}
            aria-label={label}
            type="number"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
          />
        </div>
      </>
    );
  };

  const renderTextArea = () => {
    return (
      <>
        {renderCharacterLimit()}
        <textarea
          spellCheck="true"
          className="form-control"
          lines="8"
          placeholder={placeholder}
          data-testid={dataTestId}
          aria-labelledby={label}
          aria-label={label}
          type="textarea"
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
        />
      </>
    );
  };

  const renderDateTimePicker = () => {
    return (
      <div className="">
        <MHAPicker value={value} handleChange={handleChange} />
      </div>
    );
  };

  const renderDropdown = () => {
    const dropdownLabel = value ? `${label}: ${value}` : `Select ${label}`;

    return (
      <>
        <div className="d-flex flex-row align-items-center">
          <Dropdown
            data-testid={dataTestId}
            onSelect={(e) => {
              console.log(`dropdown change: ${e}`);
              handleChange(e);
            }}
          >
            <Dropdown.Toggle> {dropdownLabel} </Dropdown.Toggle>
            <Dropdown.Menu>
              {options &&
                options.map((option, index) => {
                  return (
                    <>
                      <Dropdown.Item key={`option_${index}`} eventKey={option}>
                        {option}
                      </Dropdown.Item>
                    </>
                  );
                })}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </>
    );
  };

  const renderLabeledInput = ({ inputType }) => {
    return (
      <>
        <InputGroup onChange={(e) => handleChange(e.target.value)}>
          <InputGroup.Prepend>
            <InputGroup.Text>
              {publicLabel || label || 'missing public label'}
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            type={inputType || 'text'}
            value={value || ''}
            data-testid={dataTestId}
            aria-label={publicLabel}
          />
        </InputGroup>
      </>
    );
  };

  const renderNumberRange = ({ minLabel = 'min', maxLabel = 'max' }) => {
    const initialValue = `0,0`;
    const previousValue = value || initialValue;
    const splitValues = previousValue.split(',');

    return (
      <>
        {/* previousValue */}
        <InputGroup
          className="mb-1"
          onChange={(e) =>
            handleCombinedChange(e.target.value, 0, initialValue)
          }
        >
          <InputGroup.Prepend>
            <InputGroup.Text>{minLabel}</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            type="number"
            value={splitValues[0]}
            data-testid={dataTestId}
            aria-label={publicLabel}
          />
        </InputGroup>

        <InputGroup
          className="mb-1"
          onChange={(e) =>
            handleCombinedChange(e.target.value, 1, initialValue)
          }
        >
          <InputGroup.Prepend>
            <InputGroup.Text>{maxLabel}</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            type="number"
            value={splitValues[1]}
            data-testid={dataTestId}
            aria-label={publicLabel}
          />
        </InputGroup>
      </>
    );
  };

  const renderCheckbox = ({ type }) => {
    // const checked = value;

    return (
      <>
        <Form>
          <Form.Check
            id={label}
            type={type || 'checkbox'}
            onChange={(e) => {
              handleChange(e.target.checked);
              console.log(e.target);
            }}
            checked={value || false}
            label={publicLabel || label}
          />
        </Form>
      </>
    );
  };

  const renderSwitch = () => {
    return renderCheckbox({ type: 'switch' });
  };

  const renderTextEditor = () => {
    return (
      <>
        <MHATextEditor
          value={value}
          handleChange={handleChange}
          characterLimit={characterLimit}
        />
      </>
    );
  };

  const renderHeader = () => {
    if (type === 'subheader') {
      return (
        <>
          <h4>{publicLabel || label}</h4>
        </>
      );
    }
    return (
      <>
        <h2>{publicLabel || label}</h2>
      </>
    );
  };

  const renderJSX = () => {
    if (type === 'jsxinsert') {
      return <>{jsx}</>;
    }
  };

  const renderInput = () => {
    switch (type) {
      case 'datetimepicker':
        return renderDateTimePicker();
        break;

      case 'dropdown':
        return renderDropdown();
        break;

      case 'labeledinput':
        return renderLabeledInput({});
        break;

      case 'number':
        return renderStandardInput({ inputType: 'number' });
        break;

      case 'textverification':
        return renderTextVerification();
        break;

      /*
      case 'tel':
        return renderStandardInput({ inputType: 'tel' });
        break;
      */

      case 'labeledinputnumber':
        return renderLabeledInput({ inputType: 'number' });
        break;

      case 'numberrange':
        return renderNumberRange({ inputType: 'number' });
        break;

      case 'checkbox':
        return renderCheckbox({});
        break;

      case 'switch':
        return renderSwitch();
        break;

      case 'texteditor':
        return renderTextEditor();
        break;

      case 'textarea':
        return renderTextArea();
        break;

      case 'password':
        if (showPasswords === true) {
          return renderStandardInput({ inputType: 'text' });
        }
        return renderStandardInput({ inputType: 'password' });

        break;

      case 'subheader':
        return renderHeader();
        break;

      case 'jsxinsert':
        return renderJSX();
        break;

      case 'divider':
        return (
          <>
            <FormDivider2 />
          </>
        );
        break;

      default:
        return renderStandardInput({ inputType: 'text' });
    }
  };

  return (
    <div className="mha__input">
      {!handleUpdate && '!handleUpdate'}
      {largeLabel && (
        <>
          <h4>
            {publicLabel || label}
            {required && requiredAsterisk && (
              <>
                <Asterisk />
              </>
            )}
          </h4>
        </>
      )}

      {validationError && (
        <>
          <div className="mha__form error">{validationError}</div>
        </>
      )}

      {renderInput()}
      {description && <div className="mha__description">{description}</div>}
    </div>
  );
};

export default MHAInput;
