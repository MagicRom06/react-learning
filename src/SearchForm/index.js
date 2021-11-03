import React from 'react';
import styled from 'styled-components';
import InputWithLlabel from '../InputWithLabel/index';

const StyledButton = styled.button `
  background: transparent;
  border: 1px solid #171212;
  padding: 5px;
  cursor: pointer;
  transition: all 0.1s ease-in;

  &:hover {
    background: #171212;
    color: #ffffff;
    fill: #ffffff;
    stroke: #ffffff;
  }
`;

const StyledSearchForm = styled.form `
  padding: 10px 0 20px 0;
  display: flex;
  align-items: baseline;
`;

const StyledButtonLarge = styled(StyledButton) `
  padding: 10px;
`;

const SearchForm = ({searchTerm, onSearchInput, onSearchSubmit}) => (
    <StyledSearchForm onSubmit={onSearchSubmit}>
      <InputWithLlabel 
        id="search"
        label="Search"
        value={searchTerm}
        type="text"
        onInputChange={onSearchInput}
        isFocused
      >
        <strong>Search: </strong>
      </InputWithLlabel>
      <StyledButtonLarge type="submit" disabled={!searchTerm}>
        Submit
      </StyledButtonLarge>
    </StyledSearchForm>
  )

  export default SearchForm;