import React, { PropTypes, Component } from 'react';
import reducer from './reducers';
import { ActionCreators } from 'redux-devtools';
const { importState } = ActionCreators;

import InputModal from './InputModal';

export default class ImportExportMonitor extends Component {
  static update = reducer;

  constructor(props) {
    super(props);

    window.addEventListener('keydown', ::this.handleKeyPress);

    this.state = {
      inputOpen: false,
      importValue: ''
    };
  }

  static propTypes = {
    dispatch: PropTypes.func,
    computedStates: PropTypes.array,
    stagedActionIds: PropTypes.array,
    actionsById: PropTypes.object,
    currentStateIndex: PropTypes.number,
    committedState: PropTypes.object,
    monitorState: PropTypes.shape({
      initialScrollTop: PropTypes.number
    }),
    stagedActions: PropTypes.array,
    skippedActionIds: PropTypes.array,
    nextActionId: PropTypes.number,
    select: PropTypes.func.isRequired
  };

  static defaultProps = {
    select: (state) => state
  };

  handleKeyPress(event) {
    if (event.shiftKey && (event.metaKey || event.ctrlKey) && event.keyCode === 69) {
      event.preventDefault();
      this.setState({
        inputOpen: true
      });
    }
  }

  handleImport(newState) {
    let appState;
    try {
      appState = JSON.parse(newState);
      this.props.dispatch(importState(appState));
    } catch (e) {
      console.warn('Invalid app state JSON passed into the input prompt: ', e);
      this.props.dispatch(importState(this.getStateAndActions()));
    }
  }

  getStateAndActions() {
    return {
      monitorState: this.props.monitorState,
      actionsById: this.props.actionsById,
      nextActionId: this.props.nextActionId,
      stagedActionIds: this.props.stagedActionIds,
      skippedActionIds: this.props.skippedActionIds,
      committedState: this.props.committedState,
      computedStates: this.props.computedStates,
      currentStateIndex: this.props.currentStateIndex
    };
  }

  handleInputChange(event) {
    this.setState({
      importValue: event.target.value
    });
  }

  toggleInput() {
    this.setState({
      inputOpen: !this.state.inputOpen
    });
  }

  closeModal() {
    this.setState({ inputOpen: false });
  }

  render() {
    const serializedState = JSON.stringify(this.getStateAndActions());

    return (
      <InputModal
        isOpen={this.state.inputOpen}
        appState={serializedState}
        closeModal={::this.closeModal}
        onSubmit={::this.handleImport}
      />
    );
  }
}
