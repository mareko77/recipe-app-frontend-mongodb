import React from 'react';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
      errorMessage: '',
    };
  }

  onNameChange = (event) => {
    this.setState({ name: event.target.value });
  };

  onEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  

  onSubmitRegister = () => {
    const { name, email, password } = this.state;

    if (!name || !email || !password) {
      this.setState({ errorMessage: 'Please fill out all fields.' });
      return;
    }

    fetch('https://recipe-app-backend-mongodb-9.onrender.com/register', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
      .then((response) => response.json())
      .then((user) => {
        if (user.id) {
          this.props.loadUser(user);
          this.props.onRouteChange('home');
        } else {
          this.setState({ errorMessage: 'Unable to register. Please try again.' });
        }
      })
      .catch((err) => {
        console.error('Error during registration:', err);
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
                <legend className="f1 fw6 ph0 mh0">Register</legend>
                {errorMessage && (
                  <div className="red f6 mv3">{errorMessage}</div>
                )}
                <div className="mt3">
                  <label className="db fw6 lh-copy f6" htmlFor="name">
                    Name
                  </label>
                  <input
                    className={inputClass}
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter your name"
                    onChange={this.onNameChange}
                  />
                </div>
                <div className="mt3">
                  <label className="db fw6 lh-copy f6" htmlFor="email-address">
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
                  onClick={this.onSubmitRegister}
                  className={buttonClass}
                >
                  Register
                </button>
              </div>
              <div className="lh-copy mt3">
                <p
                  onClick={() => onRouteChange('signin')}
                  className="f6 link dim black db pointer"
                >
                  Already have an account? Sign In
                </p>
              </div>
            </div>
          </main>
        </article>
      </div>
    );
  }
}

export default Register;
