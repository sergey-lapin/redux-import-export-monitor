import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';

const style = {
  overlay: {
    zIndex: 100
  },
  content: {
    overflow: 'hidden',
    left: '25%',
    height: 10,
    width: '50%',
    display: 'flex',
    alignItems: 'center'
  }
};

const formStyle = {
  flex: 1,
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center'
};

export default class InputModal extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    appState: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      appState: props.appState
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onModalOpen = this.onModalOpen.bind(this);
    this.onRequestClose = this.onRequestClose.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let onModalOpen;
    if (!this.props.isOpen && nextProps.isOpen) {
      onModalOpen = true;
    }
    this.setState({
      appState: nextProps.appState
    }, () => {
      if (onModalOpen) {
        this.onModalOpen();
      }
    });
  }

  onInputChange(e) {
    this.setState({ appState: e.target.value });
  }

  onModalOpen() {
    this.modalInput.setSelectionRange(0, this.modalInput.value.length);
  }

  onRequestClose() {
    this.props.onSubmit(this.state.appState);
    this.props.closeModal();
  }

  onKeyDown(e) {
    if (e.keyCode === 13) {
      this.onRequestClose();
    }
  }

  render() {
    return (
      <Modal style={style} isOpen={this.props.isOpen} onRequestClose={this.onRequestClose}>
        <div style={formStyle}>
          <input ref={(ref) => this.modalInput = ref}
            style={{ flex: 10 }}
            onChange={this.onInputChange}
            value={this.state.appState}
            onKeyDown={this.onKeyDown}
          />
          <button style={{ flex: 1 }} onClick={this.props.closeModal}>Cancel</button>
        </div>
      </Modal>
    );
  }
}
