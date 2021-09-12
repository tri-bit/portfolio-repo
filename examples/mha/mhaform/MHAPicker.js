import dateFnsLocalizer from 'react-widgets-date-fns';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import ReactWidgets from 'react-widgets';
import MHAButton from './MHAButton';
import { developerMode } from '../srcClient/clientUtils';

const MHAPicker = (props) => {

  const { value, handleChange } = props;

  dateFnsLocalizer();

  const handleUpdate = (update) => {

    console.log('picker handleUpdate', update);
    const preppedUpdate = update ? update.toISOString() : null;
    console.log({ update, preppedUpdate });
    // console.log('datetimepicker update', update);
    handleChange(preppedUpdate);

  };

  return (

    <div style={{ width: 440 }} className="d-flex flex-column">

      {developerMode && (
        <div>
          value:{String(value)}
        </div>
      )}

      {!value && (

        <>
          <MHAButton onClick={() => handleUpdate(new Date())} label="Set Date/Time" />
        </>

      )}

      {value && (

        <>

          <DateTimePicker
            onChange={(newValue) => { handleUpdate(newValue); }}
            defaultValue={(new Date(value))}
          />
        </>

      )}

    </div>

  );

};

export default MHAPicker;
