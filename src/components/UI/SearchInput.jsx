/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { BsSearch } from 'react-icons/bs';

const SearchInput = (props) => (
  <div className={`${props.className ? props.className : ''} flex flex-v-center search-input bg-white`}>
    <input
      type="search"
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      onKeyPress={props.onKeyPress}
      placeholder={props.placeholder || 'Search...'}
    />
    <BsSearch />
  </div>
);

export default SearchInput;
