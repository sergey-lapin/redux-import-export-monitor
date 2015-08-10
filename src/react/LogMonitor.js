import React, { PropTypes, findDOMNode, Component } from 'react';
import LogMonitorEntry from 'redux-devtools/lib/react/LogMonitorEntry';
import ReactZeroClipboard from 'react-zeroclipboard';

export default class LogMonitor extends Component {
  constructor(props) {
    super(props);

    window.addEventListener('keydown', ::this.handleKeyPress);

    this.state = {
      inputOpen: false,
      importValue: ''
    };
  }

  static propTypes = {
    computedStates: PropTypes.array.isRequired,
    currentStateIndex: PropTypes.number.isRequired,
    monitorState: PropTypes.object.isRequired,
    stagedActions: PropTypes.array.isRequired,
    skippedActions: PropTypes.object.isRequired,
    reset: PropTypes.func.isRequired,
    commit: PropTypes.func.isRequired,
    rollback: PropTypes.func.isRequired,
    sweep: PropTypes.func.isRequired,
    toggleAction: PropTypes.func.isRequired,
    jumpToState: PropTypes.func.isRequired,
    setMonitorState: PropTypes.func.isRequired,
    recomputeStates: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired
  };

  static defaultProps = {
    select: (state) => state,
    monitorState: { isVisible: true }
  };

  componentWillReceiveProps(nextProps) {
    const node = findDOMNode(this);
    if (!node) {
      this.scrollDown = true;
    } else if (
      this.props.stagedActions.length < nextProps.stagedActions.length
    ) {
      const scrollableNode = node.parentElement;
      const { scrollTop, offsetHeight, scrollHeight } = scrollableNode;

      this.scrollDown = Math.abs(
        scrollHeight - (scrollTop + offsetHeight)
      ) < 20;
    } else {
      this.scrollDown = false;
    }
  }

  componentDidUpdate() {
    const node = findDOMNode(this);
    if (!node) {
      return;
    }

    if (this.scrollDown) {
      const scrollableNode = node.parentElement;
      const { offsetHeight, scrollHeight } = scrollableNode;

      scrollableNode.scrollTop = scrollHeight - offsetHeight;
      this.scrollDown = false;
    }
  }

  handleRollback() {
    this.props.rollback();
  }

  handleSweep() {
    this.props.sweep();
  }

  handleCommit() {
    this.props.commit();
  }

  handleToggleAction(index) {
    this.props.toggleAction(index);
  }

  handleReset() {
    this.props.reset();
  }

  handleKeyPress(event) {
    const { monitorState } = this.props;

    if (event.ctrlKey && event.keyCode === 72) { // Ctrl+H
      event.preventDefault();
      this.props.setMonitorState({
        ...monitorState,
        isVisible: !monitorState.isVisible
      });
    }
  }

  handleImport() {
    let importValue = JSON.parse(this.state.importValue);
    let { committedState, stagedActions } = importValue;

    this.toggleInput();
    this.props.recomputeStates(committedState, stagedActions);
  }

  getStateAndActions() {
    return JSON.stringify({
      committedState: this.props.computedStates[0].state,
      stagedActions: this.props.stagedActions
    });
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

  renderInput() {
    return (
      <div>
        <input type='text' name='import' onChange={::this.handleInputChange} />
        <a onClick={::this.handleImport}
           style={{ textDecoration: 'underline', cursor: 'hand' }}>
          <small>Save</small>
        </a>
      </div>
    );
  }

  render() {
    const elements = [];
    const { monitorState, skippedActions, stagedActions, computedStates, select } = this.props;

    if (!monitorState.isVisible) {
      return null;
    }

    for (let i = 0; i < stagedActions.length; i++) {
      const action = stagedActions[i];
      const { state, error } = computedStates[i];

      elements.push(
        <LogMonitorEntry key={i}
                         index={i}
                         select={select}
                         action={action}
                         state={state}
                         collapsed={skippedActions[i]}
                         error={error}
                         onActionClick={::this.handleToggleAction} />
      );
    }

    let serializedState = this.getStateAndActions();

    let input = this.state.inputOpen ? this.renderInput() : <div></div>;

    return (
      <div style={{
        fontFamily: 'monospace',
        position: 'relative',
        padding: '1rem'
      }}>
        <div>
          <div style={{
            paddingBottom: '.5rem'
          }}>
            <small>Press Ctrl+H to hide.</small>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <a onClick={::this.handleReset}
               style={{ textDecoration: 'underline', cursor: 'hand' }}>
              <small>Reset</small>
            </a>
            <a
               style={{ textDecoration: 'underline', cursor: 'hand' }}>
              <ReactZeroClipboard text={serializedState}>
                <small>Export</small>
              </ReactZeroClipboard>
            </a>
            <a onClick={::this.toggleInput}
               style={{ textDecoration: 'underline', cursor: 'hand' }}>
              <small>Import</small>
            </a>
          </div>
        </div>
        {input}
        {elements}
        <div>
          {computedStates.length > 1 &&
            <a onClick={::this.handleRollback}
               style={{ textDecoration: 'underline', cursor: 'pointer' }}>
              Rollback
            </a>
          }
          {Object.keys(skippedActions).some(key => skippedActions[key]) &&
            <span>
              {' • '}
              <a onClick={::this.handleSweep}
                 style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                Sweep
              </a>
            </span>
          }
          {computedStates.length > 1 &&
            <span>
              <span>
              {' • '}
              </span>
              <a onClick={::this.handleCommit}
                 style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                Commit
              </a>
            </span>
          }
        </div>
      </div>
    );
  }
}
