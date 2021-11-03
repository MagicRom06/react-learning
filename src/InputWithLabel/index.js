import React from 'react';
import styled from 'styled-components';


const StyledLabel = styled.label `
  border-top: 1px solid #171212;
  border-left: 1px solid #171212;
  padding-left: 5px;
  font-size: 24px;
`;

const InputWithLlabel = ({ id, value, type, onInputChange, children, isFocused }) => {

    const inputRef = React.useRef();
  
    React.useEffect(() => {
      if (isFocused && inputRef.current) {
        inputRef.current.focus()
      }
    }, [isFocused]);
  
    return (
      <>
        <StyledLabel htmlFor={id} className="label">{children}</StyledLabel>
        <input 
          ref={inputRef}
          onChange={onInputChange} 
          id={id}
          type={type}
          value={value}
          autoFocus={isFocused}
          className="input"
        />
      </>
    )
  }

  export default InputWithLlabel;