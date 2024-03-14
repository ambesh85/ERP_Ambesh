import { render} from '@testing-library/react';
import React from "react";
import Login from "./Login";
import axios from "axios";
import Employee from '../Employee';
import Admin from '../Admin'

jest.mock('axios');

test('renders learn react link', () => {
    axios.mockReturnValue({
        data:data,
    })
    const {debug} = render(<Login />);
  });