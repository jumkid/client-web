import React from 'react';
import PropTypes from 'prop-types';

function NavButtons ({ items, handleClick }) {
  return (
    <nav>
      <ul>
        {items.map((item, index) =>
          <li key={ index } className={ item.isCurrent ? 'current_page_item' : '' }><a href={item.route}>{ item.title }</a></li>
        )}
      </ul>
    </nav>
  );
}

NavButtons.propTypes = {
  items: PropTypes.array.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default NavButtons;
