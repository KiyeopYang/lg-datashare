import React from 'react';
import { Button, Image, List, Popup } from 'semantic-ui-react';

const defaultItems = [
  {
    id: '1',
    name: 'Lena',
    description: 'requesting',
  },
  {
    id: '2',
    name: 'Lindsay',
  },
  {
    id: '3',
    name: 'Mark',
    activityName: 'accept',
    onClick: () => {
      alert('click');
    },
  },
  {
    id: '4',
    name: 'Molly',
    activityName: 'accept',
    onClick: () => {
      alert('click');
    },
    disabled: true,
  },
];
const UserList = ({ onClick, items = defaultItems }) => (
  <List
    divided
    selection={Boolean(onClick)}
    verticalAlign="middle"
    style={{ maxHeight: '250px', overflowY: 'auto' }}
  >
    {items.map((item) => (
      <List.Item
        key={item.id}
        onClick={
          onClick
            ? () => {
                onClick(item);
              }
            : undefined
        }
      >
        {item.onClick ? (
          <List.Content floated="right">
            <Button
              compact
              disabled={item.disabled}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                item.onClick();
              }}
              positive={item.activityType === 'positive'}
              negative={item.activityType === 'negative'}
            >
              {item.activityName}
            </Button>
          </List.Content>
        ) : null}
        <Image
          avatar
          src="/default-avatar.png"
          style={
            item.active
              ? {
                  border: '2px solid green',
                }
              : { padding: 2 }
          }
        />

        <List.Content>
          <List.Header>{item.name}</List.Header>
          {item.description ? (
            <List.Description>{item.description}</List.Description>
          ) : null}
        </List.Content>
      </List.Item>
    ))}
  </List>
);

export default UserList;
