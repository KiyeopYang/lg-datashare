import React from 'react';
import { Button, Header, Image, Modal } from 'semantic-ui-react';

function Modal_({
  open,
  onClose,
  onOpen,
  image = 'https://react.semantic-ui.com/images/avatar/large/rachel.png',
  title = 'User',
  subTitle = 'User A',
  description = 'I am user A.',
  button1 = {
    content: 'Add to freinds',
    positive: true,
    onClick: () => {},
  },
  button2,
}) {
  return (
    <Modal
      onClose={onClose}
      onOpen={onOpen}
      open={open}
      style={{
        marginTop: 0,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
      }}
    >
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content image>
        {image ? <Image size="small" src={image} wrapped /> : null}
        <Modal.Description>
          <Header>{subTitle}</Header>
          <p>{description}</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Close</Button>
        {button1 ? (
          <Button
            content={button1.content}
            onClick={button1.onClick}
            positive={button1.positive}
            negative={button1.negative}
          />
        ) : null}
        {button2 ? (
          <Button
            content={button2.content}
            onClick={button2.onClick}
            positive={button2.positive}
            negative={button2.negative}
          />
        ) : null}
      </Modal.Actions>
    </Modal>
  );
}

export default Modal_;
