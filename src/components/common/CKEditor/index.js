import React from 'react';
import PropTypes from 'prop-types';
import { getEditorNamespace } from 'ckeditor4-integrations-common';

class CKEditor extends React.Component {
  constructor( props ) {
    super( props );

    this.element = null;
    this.editor = null;
    this._destroyed = false;
  }

  componentDidMount() {
    this._initEditor();
  }

  componentWillUnmount() {
    this._destroyEditor();
  }

  componentDidUpdate( prevProps ) {
    const { props, editor } = this;

    /* istanbul ignore next */
    if ( !editor ) {
      return;
    }

    if ( prevProps.data !== props.data && editor.getData() !== props.data ) {
      editor.setData( props.data );
    }

    if ( prevProps.readOnly !== props.readOnly ) {
      editor.setReadOnly( props.readOnly );
    }

    if ( prevProps.style !== props.style ) {
      editor.container.setStyles( props.style );
    }

    this._attachEventHandlers( prevProps );
  }

  render() {
    return <div id={ this.props.name } name={ this.props.name } style={ this.props.style } ref={ ref => ( this.element = ref ) }></div>;
  }

  _initEditor() {
    const { config, readOnly, type, onBeforeLoad, onNamespaceLoaded, style } = this.props;
    config.readOnly = readOnly;

    getEditorNamespace( CKEditor.editorUrl, onNamespaceLoaded ).then( CKEDITOR => {
      // (#94)
      if ( this._destroyed ) {
        return;
      }

      // (#94)
      if ( !this.element ) {
        throw new Error( 'Element not available for mounting CKEDITOR instance.' );
      }

      const constructor = type === 'inline' ? 'inline' : 'replace';

      if ( onBeforeLoad ) {
        onBeforeLoad( CKEDITOR );
      }

      const editor = this.editor = CKEDITOR[ constructor ]( this.element, config );

      this._attachEventHandlers();

      // We must force editability of the inline editor to prevent `element-conflict` error.
      // It can't be done via config due to CKEditor 4 upstream issue (#57, ckeditor/ckeditor4#3866).
      if ( type === 'inline' && !readOnly ) {
        editor.on( 'instanceReady', () => {
          editor.setReadOnly( false );
        }, null, null, -1 );
      }

      // (#114, #127)
      // Make sure that the freshest data is read from props when editor is ready.
      editor.on( 'instanceReady', () => {
        const data = this.props.data;

        if ( data ) {
          editor.setData( data );
        }
      }, null, null, -1 );

      if ( style && type !== 'inline' ) {
        editor.on( 'loaded', () => {
          editor.container.setStyles( style );
        } );
      }
    } ).catch( console.error );
  }

  _attachEventHandlers( prevProps = {} ) {
    const props = this.props;

    Object.keys( this.props ).forEach( propName => {
      if ( !propName.startsWith( 'on' ) || prevProps[ propName ] === props[ propName ] ) {
        return;
      }

      this._attachEventHandler( propName, prevProps[ propName ] );
    } );
  }

  _attachEventHandler( propName, prevHandler ) {
    const evtName = `${ propName[ 2 ].toLowerCase() }${ propName.substr( 3 ) }`;

    if ( prevHandler ) {
      this.editor.removeListener( evtName, prevHandler );
    }

    this.editor.on( evtName, this.props[ propName ] );
  }

  _destroyEditor() {
    if ( this.editor ) {
      this.editor.destroy();
    }

    this.editor = null;
    this.element = null;
    this._destroyed = true;
  }
}

CKEditor.propTypes = {
  type: PropTypes.oneOf( [
    'classic',
    'inline'
  ] ),
  data: PropTypes.string,
  config: PropTypes.object,
  name: PropTypes.string,
  style: PropTypes.object,
  readOnly: PropTypes.bool,
  onBeforeLoad: PropTypes.func,
  onNamespaceLoaded: PropTypes.func
};

CKEditor.defaultProps = {
  type: 'classic',
  data: '',
  config: {},
  readOnly: false
};

CKEditor.editorUrl = 'https://cdn.ckeditor.com/4.16.1/standard-all/ckeditor.js';
CKEditor.displayName = 'CKEditor';

export default CKEditor;
