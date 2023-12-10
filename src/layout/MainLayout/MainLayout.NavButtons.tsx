import React from 'react';
import MenuSetting from './model/MenuSetting';
import { HandleClick } from './model';

type Props = {
    items: MenuSetting[]
    handleClick: HandleClick
}

function NavButtons ({ items, handleClick }:Props) {
  return (
    <nav>
      <ul>
        {items.map((item:MenuSetting, index:number) =>
          <li key={ index } className={ item.isCurrent ? 'current_page_item' : '' } onClick={() => handleClick(index)}>
            <a href={item.route}>{ item.title }</a>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavButtons;
