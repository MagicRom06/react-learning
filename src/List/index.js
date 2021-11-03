import React from 'react';
import styled from 'styled-components';

const StyledItem = styled.div `
  display: flex;
  align-items: center;
  padding-bottom: 5px;
`;

const StyledColumn = styled.span `
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  a {
    color: inherite;
  }

  width: ${props => props.width};
`;

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

const StyledButtonSmall = styled(StyledButton) `
  padding: 5px;
`;

const List = React.memo(({list, onRemoveItem}) => {
    return list.map(item => (
      <Item 
        key={item.objectID}
        item={item}
        onRemoveItem={onRemoveItem}
      />
    ));
})

const Item = ({ item, onRemoveItem }) => {

    return (
    <StyledItem key={item.objectID}>
      <StyledColumn width='40%'>
        <a href={item.url}>{item.title}</a>
      </StyledColumn>
      <StyledColumn width='30%'>{item.author}</StyledColumn>
      <StyledColumn width='10%'>{item.num_comments}</StyledColumn>
      <StyledColumn width='10%'>{item.points}</StyledColumn>
      <StyledColumn width= '30%'>
        <StyledButtonSmall type="button" onClick={() => onRemoveItem(item)}>
        <Icon />
        </StyledButtonSmall>
      </StyledColumn>
    </StyledItem>
    )
  }

const Icon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      x="0"
      y="0"
      version="1.1"
      viewBox="0 0 755 607"
      xmlSpace="preserve"
    >
      <path
        fill="#21b04b"
        d="M225.38 585.25L198.61 550l-43.889-50.323-50.221-40.088-56.75-35.997L23 410.595 38.5 336 54 258.835 55.51 256l20.25 9.424 18.74 9.423 29.11 29.327 29.111 29.326 13.215 21.25L179.871 376l97.457-102L398.5 159.519l89-69.957 114.973-79.37L659.544 81.5l64.611 81.838 8.814 12-62.25 36.092-62.219 34.93L543 292.32 378.767 420.175 334.033 460.5l-37.6 42.5-52.767 63.226-16.175 20.75z"
      ></path>
    </svg>
  );
}

export default List;