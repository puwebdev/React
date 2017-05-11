import React, { Component, PropTypes } from 'react';

export const renderInput = ({ input, label, placeholder, isBig, icon, type, meta: { touched, error, invalid } }) => (
  <div className={`form-group ${touched && invalid ? 'has-error' : ''}`}>
      {icon &&
        <div className="input-group">
          <span className="input-group-addon"><i className={icon}></i> {label}</span>
          <input {...input} placeholder={placeholder} onChange={input.onChange} className={`form-control ${isBig ? 'input-lg' : ''}`}/>
        </div>
      }
      {!icon &&
        <div>
          <label className="control-label">{label}</label>
          <div>
            <input {...input} placeholder={placeholder} onChange={input.onChange} className={`form-control ${isBig ? 'input-lg' : ''}`}/>
          </div>
        </div>
      }
      <div className="help-block">
        {touched && error && <span>{error}</span>}
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

export const getOptionTag = function(option, groupedBy) {
  let theKey = option.key || option.value;
  return (
    <option value={option.value} data-groupedby={groupedBy} key={theKey}>{option.label}</option>
  );
}

export const getOptionTags = function(options, groupedBy) {
  return options.map((option) => {
    return getOptionTag(option, groupedBy);
  });
}

export const getOptions = function(options, groupBy) {
  if (groupBy) {
    return getOptgroupTags(options, groupBy);
  } else {
    return getOptionTags(options, groupBy);
  }
}

export const getOptgroupTags = function(groups, groupBy) {
  var optgroups = groups.map((group) => {
    var children = getOptionTags(group[groupBy], group.value);
    return (
      <optgroup key={group.value} label={group.label}>
        {children}
      </optgroup>
    );
  });

  return optgroups;
}

export const renderObjectSelect = ({ input, label, dataArray, withoutNone, groupBy, onChange, type, meta: { touched, error, invalid } }) => (
  <div className={`form-group ${touched && invalid ? 'has-error' : ''}`}>
    <label className="control-label">{label}</label>
    <div>
      <select {...input} className="form-control">
        {!withoutNone && 
          <option value="">(None)</option>
        }
        {dataArray && getOptions(dataArray, groupBy)}
      </select>
      <div className="help-block">
        {touched && error && <span>{error}</span>}
      </div>
    </div>
  </div>
)