import React from 'react';

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: '',
      signInPassword: '',
      errorMessage: '',
    }
  }

  onEmailChange = (event) => {
    this.setState({signInEmail: event.target.value})
  }

  onPasswordChange = (event) => {
    this.setState({signInPassword: event.target.value})

    
  }

  onSubmitSignIn = () => {
    const { signInEmail, signInPassword } = this.state;

    if (!signInEmail || !signInPassword) {
      this.setState({ errorMessage: 'Please enter both email and password.' });
      return;
    }

    fetch('https://recipe-app-backend-mongodb-9.onrender.com/signin', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: signInEmail, password: signInPassword }),
    })
      .then((response) => response.json())
      .then((user) => {
        if (user.id) {
          this.props.loadUser(user);
          this.props.onRouteChange('home');
        } else {
          this.setState({ errorMessage: 'Invalid email or password. Please try again.' });
        }
      })
      .catch((err) => {
        console.error('Error during sign-in:', err);
        this.setState({ errorMessage: 'An error occurred. Please try again later.' });
      });
  };

  render() {
    const { onRouteChange } = this.props;
    const { errorMessage } = this.state;

    const inputClass =
      'pa2 input-reset ba bg-transparent hover-bg-light-blue hover-white w-100';
    const buttonClass =
      'b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib';

    return (
      <div>
        <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
          <main className="pa4 black-80">
            <div className="measure">
              <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                {errorMessage && (
                  <div className="red f6 mv3">{errorMessage}</div>
                )}
                <div className="mt3">
                  <label
                    className="db fw6 lh-copy f6"
                    htmlFor="email-address"
                  >
                    Email
                  </label>
                  <input
                    className={inputClass}
                    type="email"
                    name="email-address"
                    id="email-address"
                    placeholder="Enter your email"
                    onChange={this.onEmailChange}
                  />
                </div>
                <div className="mv3">
                  <label className="db fw6 lh-copy f6" htmlFor="password">
                    Password
                  </label>
                  <input
                    className={inputClass}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    onChange={this.onPasswordChange}
                  />
                </div>
              </fieldset>
              <div className="">
                <button
                  onClick={this.onSubmitSignIn}
                  className={buttonClass}
                >
                  Sign In
                </button>
              </div>
              <div className="lh-copy mt3">
                <p
                  onClick={() => onRouteChange('register')}
                  className="f6 link dim black db pointer"
                >
                  Register
                </p>
              </div>
            </div>
          </main>
        </article>
      </div>
    );
  }
}

export default Signin;
