import React, { Component } from 'react';
import TinyMCE from 'react-tinymce';


export class renderTinyMce extends Component {

  constructor(props) {
    super(props);
    this.editorContent = this.editorContent.bind(this);
  }

  tinyMceConfig = {
    plugins: 'advlist autolink lists link image code',
    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | bullist numlist outdent indent | link image | createspan removespan',
    menubar: 'edit insert view format table tools',
    statusbar: false,
    paste_word_valid_elements: 'b,strong,i,em,h1,h2,h3,p,li,ul,ol,a',
    paste_retain_style_properties: 'none',
    paste_strip_class_attributes: 'none',
    paste_remove_styles: true,
    extended_valid_elements: "span[class]",
    setup: function(editor) {
        editor.addButton('createspan', {
            text: "Create Span Link",
            icon: false,
            onclick: function() {
                if (editor.selection.getContent({format: 'text'}) === "") return;
                window.app3dRightClickNav._htmlEditor._createSpan.show(editor);
            }
        });
        editor.addButton('removespan', {
            text: "Remove Span Link",
            icon: false,
            onclick: function() {
              var txt = "";
                if (editor.selection.getNode().nodeName === "SPAN") {
                    txt = editor.selection.getNode().textContent;
                    editor.dom.remove(editor.selection.getNode());
                }
                editor.selection.setContent(txt);
            }
        });
    },
    content_style: "span {color: orange}",
    body_class: 'editable-tinymce-content'
  }

  componentWillReceiveProps() {
    const editor = tinymce.EditorManager.get(this.props.input.name);
    if (editor && editor.getContent({format: 'raw'}) !== nextProps.content) {
      tinymce.EditorManager.get(this.props.input.name).setContent(nextProps.content)
    }
  }

  editorContent() {
      return tinyMCE.get(this.props.input.name) ? tinyMCE.get(this.props.input.name).getContent() : '';
  }

  render() {
    const { input: { value, name }, label, placeholder, height, meta: { touched, error, invalid } } = this.props;

    return (
    <div className={`form-group ${touched && invalid ? 'has-error' : ''}`}>
      <label className="control-label">{label}</label>
      <div>      
        <TinyMCE
          id={name} className="form-control"
          content={value}
          config={Object.assign(this.tinyMceConfig, { height: height || "80" })}
          onBlur={() => {
            this.props.input.onBlur();
            this.props.input.onChange(this.editorContent());
          }}
        />
        <div className="help-block">
        {touched && error && <span>{error}</span>}
        </div>
      </div>
    </div>
    );
  }
}

export class RenderTinyMceNoField extends Component {

  constructor(props) {
    super(props);
    this.editorContent = this.editorContent.bind(this);
  }

  tinyMceConfig = {
    plugins: 'advlist autolink lists link image code',
    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | bullist numlist outdent indent | link image | createspan removespan',
    menubar: 'edit insert view format table tools',
    statusbar: false,
    paste_word_valid_elements: 'b,strong,i,em,h1,h2,h3,p,li,ul,ol,a',
    paste_retain_style_properties: 'none',
    paste_strip_class_attributes: 'none',
    paste_remove_styles: true,
    extended_valid_elements: "span[class]",
    setup: function(editor) {
        editor.addButton('createspan', {
            text: "Create Span Link",
            icon: false,
            onclick: function() {
                if (editor.selection.getContent({format: 'text'}) === "") return;
                window.app3dRightClickNav._htmlEditor._createSpan.show(editor);
            }
        });
        editor.addButton('removespan', {
            text: "Remove Span Link",
            icon: false,
            onclick: function() {
              var txt = "";
                if (editor.selection.getNode().nodeName === "SPAN") {
                    txt = editor.selection.getNode().textContent;
                    editor.dom.remove(editor.selection.getNode());
                }
                editor.selection.setContent(txt);
            }
        });
    },
    content_style: "span {color: orange}",
    body_class: 'editable-tinymce-content'
  }  

  componentWillReceiveProps() {
    return false;
  }

  editorContent() {
      return tinyMCE.get(this.props.name) ? tinyMCE.get(this.props.name).getContent() : '';
  }

  render() {
    const { name, value, label, height, ...props } = this.props;

    return (
    <div className="form-group">
      <label className="control-label">{label}</label>
      <div>      
        <TinyMCE
          id={name} className="form-control"
          content={value}
          config={Object.assign(this.tinyMceConfig, { height: height || "80" })}
          onBlur={() => {
            props.onChange({name: name, value: this.editorContent()});
          }}
        />
      </div>
    </div>
    );
  }
}