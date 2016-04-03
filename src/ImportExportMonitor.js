import React, { PropTypes, Component } from 'react';
import { ActionCreators } from 'redux-devtools';
import parseKey from 'parse-key';

const { importState } = ActionCreators;

import reducer from './reducers';
import InputModal from './InputModal';

export default class ImportExportMonitor extends Component {
  static update = reducer;

  constructor(props) {
    super(props);

    this.state = {
      inputOpen: false
    };

    this.matchesKey = this.matchesKey.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleImport = this.handleImport.bind(this);
    this.getStateAndActions = this.getStateAndActions.bind(this);
    this.closeModal = this.closeModal.bind(this);
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
    select: PropTypes.func.isRequired,
    openModalKey: PropTypes.string
  };

  static defaultProps = {
    select: (state) => state,
    openModalKey: 'meta-shift-e'
  };

  componentDidMount() {
    window.addEventListener('keydown', ::this.handleKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', ::this.handleKeyPress);
  }

  matchesKey(key, event) {
    const charCode = event.keyCode || event.which;
    const char = String.fromCharCode(charCode);
    return key.name.toUpperCase() === char.toUpperCase() &&
      key.alt === event.altKey &&
      key.ctrl === event.ctrlKey &&
      key.meta === event.metaKey &&
      key.shift === event.shiftKey;
  }

  handleKeyPress(e) {
    const modalKey = parseKey(this.props.openModalKey);

    if (this.matchesKey(modalKey, e)) {
      e.preventDefault();
      this.setState({ inputOpen: true });
    }
  }

  handleImport(newState) {
    try {
      const appState = JSON.parse(newState);
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
      computedStates: [], // trigger instrument.recomputeStates()
      currentStateIndex: this.props.currentStateIndex
    };
  }

  closeModal() {
    this.setState({ inputOpen: false });
  }

  render() {
    const appState = JSON.stringify(this.getStateAndActions());

    return (
      <InputModal
        isOpen={this.state.inputOpen}
        appState={appState}
        closeModal={this.closeModal}
        onSubmit={this.handleImport}
      />
    );
  }
}
