import React from "react";
import classNames from "classnames";

import "./index.scss";

export default class ThemeLogger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false
    };
  }

  toggleLogger() {
    this.setState({isExpanded: !this.state.isExpanded});
  }

  render() {
    const { isExpanded } = this.state;
    const { theme } = this.props;
    console.log(theme.title); // eslint-disable-line
    const loggerButtonText = isExpanded ? "Hide Logger" : "Show Logger";
    return (
      <div className="theme-logger">
        <pre className={classNames("theme-logger__display", {"show": isExpanded})}>
        { JSON.stringify(theme, null, 2) }
        </pre>
        <button className="theme-logger__toggle" onClick={this.toggleLogger.bind(this)}>
          { loggerButtonText }
        </button>
      </div>
    );
  }
}
