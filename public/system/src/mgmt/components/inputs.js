import React, { Component, PropTypes } from 'react';

export const renderInput = ({ input, label, placeholder, isBig, type, meta: { touched, error, invalid } }) => (
  <div className={`form-group ${touched && invalid ? 'has-error' : ''}`}>
    <label className="control-label">{label}</label>
    <div>
      <input {...input} placeholder={placeholder} onChange={input.onChange} className={`form-control ${isBig ? 'input-lg' : ''}`}/>
      <div className="help-block">
        {touched && error && <span>{error}</span>}
      </div>
    </div>
  </div>
)

export const renderTextarea = ({ input, label, placeholder, type, meta: { touched, error, invalid } }) => (
  <div className={`form-group ${touched && invalid ? 'has-error' : ''}`}>
    <label className="control-label">{label}</label>
    <div>
      <textarea {...input} placeholder={placeholder} className="form-control"/>
      <div className="help-block">
        {touched && error && <span>{error}</span>}
      </div>
    </div>
  </div>
)

export const renderSelect = ({ input, label, dataArray, withoutNone, type, meta: { touched, error, invalid } }) => (
  <div className={`form-group ${touched && invalid ? 'has-error' : ''}`}>
    <label className="control-label">{label}</label>
    <div>
      <select {...input} className="form-control">
        {!withoutNone && 
          <option value="">(None)</option>
        }
        {_.map(dataArray, (dOption, idx) =>
              <option value={dOption} key={idx}>{dOption}</option>)}
      </select>
      <div className="help-block">
        {touched && error && <span>{error}</span>}
      </div>
    </div>
  </div>
)

export const renderObjectSelect = ({ input, label, dataArray, withoutNone, type, meta: { touched, error, invalid } }) => (
  <div className={`form-group ${touched && invalid ? 'has-error' : ''}`}>
    <label className="control-label">{label}</label>
    <div>
      <select {...input} className="form-control">
        {!withoutNone && 
          <option value="">(None)</option>
        }
        {_.map(dataArray, (dOption, idx) =>
          <option value={dOption.value} key={idx}>{dOption.label}</option>)}
      </select>
      <div className="help-block">
        {touched && error && <span>{error}</span>}
      </div>
    </div>
  </div>
)

export const renderQSelect = ({ input, label, dataArray, selectedValue, onChange, type, meta: { touched, error, invalid } }) => (
    <div className={`form-group ${touched && invalid ? 'has-error' : ''}`}>
      <label className="control-label">{label}</label>
      <div>
        <select {...input} value={selectedValue} className="form-control" onChange={onChange}>         
          {_.map(dataArray, (grade) =>
              <option value={grade.value} key={grade.value}>{grade.label}</option>)}
        </select>
        <div className="help-block">
          {touched && error && <span>{error}</span>}
        </div>
      </div>
    </div>
)
