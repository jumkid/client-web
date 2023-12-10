import React from  'react';

interface Props {
  errorMessage?:string
}

class SafeComponent extends React.Component<any, any> {

  constructor ({errorMessage}:Props) {
    super({errorMessage});
    this.state = {
      hasError: false,
      errorMessage: errorMessage || 'Component cannot be loaded'
    }
  }

  static getDerivedStateFromError(error:Error) {
    return {hasError: true, errorMessage: error.message}
  }

  componentDidCatch (error: Error, errorInfo: React.ErrorInfo) {}

  render () {
    return  <>
      {this.state.hasError
        ? this.state.errorMessage
        : this.props.children
      }
    </>
  }
}

export default SafeComponent;