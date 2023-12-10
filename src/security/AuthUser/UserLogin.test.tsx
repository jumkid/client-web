import React from 'react';
import UserLogin from './UserLogin';
import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as router from 'react-router';
import authenticationManager from '../Auth/AuthenticationManager';
import Mock = jest.Mock;

describe(UserLogin, () => {
  let wrapper: RenderResult<typeof import("@testing-library/dom/types/queries"), HTMLElement, HTMLElement>;
  let user = {username: 'test', password: 'pass'};
  let usernameInput:HTMLElement, passwordInput:HTMLElement, submitBtn:HTMLElement;
  let navigate:Mock;

  beforeEach(() => {
    navigate = jest.fn((path:string) => {});
    // jest.mock('react-router', () => ({
    //   ...jest.requireActual('react-router'),
    //   useNavigate: jest.fn(() => navigate)
    // }));
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate);

    wrapper = render(<UserLogin/>, { wrapper: MemoryRouter });
    usernameInput = wrapper.getByRole('textbox', {name: /username/i});
    /*-- getByRole does not work with password input --*/
    passwordInput = wrapper.getByTestId('password');
    submitBtn = wrapper.getByRole('button', {name: /submit/i});
  });

  it('Should render user login correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(passwordInput).toHaveProperty('type', 'password');
  });

  it('Should not be able to submit if username or password is empty', () => {
    fireEvent.change(usernameInput, {target: {value: ''}});
    fireEvent.change(passwordInput, {target: {value: ''}});

    //wrapper.debug();
    expect(submitBtn).toHaveProperty('disabled', true);
  });

  it('Should be able to submit if username and password are filled', () => {
    fireEvent.change(usernameInput, {target: {value: user.username}});
    fireEvent.change(passwordInput, {target: {value: user.password}});

    //wrapper.debug();
    expect(usernameInput).toHaveProperty('value', user.username);
    expect(passwordInput).toHaveProperty('value', user.password);
    expect(submitBtn).toHaveProperty('disabled', false);
  });

  it('Should login if username and password are correct', async () => {
    const response = {isSuccess: true, status: 200};

    //jest.spyOn(router, 'useNavigate').mockImplementation(() => {return jest.fn()});
    authenticationManager.login = jest.fn().mockResolvedValue(response);

    await act(() => {
      fireEvent.change(usernameInput, {target: {value: user.username}});
      fireEvent.change(passwordInput, {target: {value: user.password}});
      fireEvent.click(submitBtn);

      expect(authenticationManager.login).toBeCalledWith(user.username, user.password);
      expect(authenticationManager.login()).resolves.toMatchObject(response);
    });
  });

  it('Should not be able to login if username or password is incorrect', async () => {
    const response = {isSuccess: false, status: 401};
    authenticationManager.login = jest.fn().mockRejectedValue(response);

    await act(() => {
      fireEvent.change(usernameInput, {target: {value: user.username}});
      fireEvent.change(passwordInput, {target: {value: 'dummy'}});
      fireEvent.click(submitBtn);

      expect(authenticationManager.login).toHaveBeenCalledWith(user.username, 'dummy');
      expect(authenticationManager.login()).rejects.toMatchObject(response);
    });
  });

});