import React from 'react';
import { useModal } from '../../Context/Modal';

function OpenMenu({
  modalComponent,
  itemText, 
  onItemClick,
  onModalClose
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (onItemClick) onItemClick();
  };

  return (
    <button onClick={onClick}>{itemText}</button>
  );
}

export default OpenMenu;