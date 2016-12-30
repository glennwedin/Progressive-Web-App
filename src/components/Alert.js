import React from 'react';
const Alert = (props) => {
  return (
    <div className={'alert '+ (props.msg ? 'visible' : '')}>
      <p>{props.msg}</p>
    </div>
  )
}
export default Alert;
