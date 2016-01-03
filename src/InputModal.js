import React, { Component, PropTypes } from 'react';
import Modal from 'react-modal';

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

  onInputChange = (e) => {
    this.setState({
      appState: e.target.value
    });
  }

  onModalOpen = () => {
    this.modalInput.setSelectionRange(0, this.modalInput.value.length);
  }

  onRequestClose = () => {
    this.props.onSubmit(this.state.appState);
    this.props.closeModal();
  }

  render() {
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

    return (
      <Modal style={style} isOpen={this.props.isOpen} onRequestClose={::this.onRequestClose}>
        <form style={formStyle} onSubmit={this.onRequestClose}>
          <input ref={(ref) => this.modalInput = ref}
            style={{ flex: 10 }}
            onChange={this.onInputChange}
            value={this.state.appState}
          />
        <button style={{ flex: 1 }} onClick={this.props.closeModal}>Cancel</button>
        </form>
      </Modal>
    );
  }
}
