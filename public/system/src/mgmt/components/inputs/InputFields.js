import React, { Component, PropTypes } from 'react';
      
export const renderProductSelect = ({ input, label, dataArray, selectedValue, onChange, type, meta: { touched, error, invalid } }) => (
  <div className={`form-group ${touched && invalid ? 'has-error' : ''}`}>
    <label className="control-label">{label}</label>
    <div>
      <select {...input} value={selectedValue} className="form-control" onChange={onChange}>      
        {_.map(dataArray, (dOption, idx) =>
              <option value={dOption} key={idx}>{dOption}</option>)}
      </select>
      <div className="help-block">
        {touched && error && <span>{error}</span>}
      </div>
    </div>
  </div>
)
