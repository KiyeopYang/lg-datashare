/*
  Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except
  in compliance with the License. A copy of the License is located at

      http://aws.amazon.com/apache2.0/

  or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, Switch, Route } from 'react-router-dom';
import {
  Container,
  Menu,
  Tab,
  Label,
  Button,
  Image,
  List,
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import Modal from './Modal';
import Chat from './Chat/Chat';
import Rooms from './Rooms/Rooms';
import Spinner from './Spinner';
import UserList from './UserList';
import { handleSignOut, loggedInStatusChanged } from '../actions/authActions';
import * as IoT from '../lib/aws-iot';
import {
  acquirePublicPolicies,
  deviceConnectedStatusChanged,
  attachMessageHandler,
} from '../actions/iotActions';
import RootRouter from './Routers/RootRouter';

const styles = {
  container: {
    marginTop: '7em',
    display: 'flex',
  },
  tab: {
    width: 260,
    height: '100vh',
    borderRight: '1px solid #dfdfdf',
    paddingRight: 40,
  },
  room: {
    width: 700,
  },
};

/**
 * Entry component to the authenticated portion of the app
 */
export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enterApp: false,
      modalOpen: false,
      modalProps: {},
    };
    this.signOut = this.signOut.bind(this);
  }

  componentWillMount() {
    this.validateUserSession();
  }

  componentDidMount() {
    const connectCallback = () => this.props.deviceConnectedStatusChanged(true);
    const closeCallback = () => this.props.deviceConnectedStatusChanged(false);
    this.props.acquirePublicPolicies(connectCallback, closeCallback);
  }

  componentWillReceiveProps(nextProps) {
    const {
      connectPolicy,
      publicPublishPolicy,
      publicSubscribePolicy,
      publicReceivePolicy,
      deviceConnected,
      identityId,
    } = nextProps;

    if (
      connectPolicy &&
      publicPublishPolicy &&
      publicSubscribePolicy &&
      publicReceivePolicy &&
      deviceConnected
    ) {
      // Ping to test connection
      const topic = `room/public/ping/${identityId}`;
      IoT.publish(topic, JSON.stringify({ message: 'connected' }));
      // Attach message handler if not yet attached
      this.props.attachMessageHandler();
      this.setState({
        enterApp: true,
      });
    }
  }

  validateUserSession() {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
      this.props.loggedInStatusChanged(true);
    } else {
      this.props.loggedInStatusChanged(false);
    }
  }

  signOut(e) {
    e.preventDefault();
    this.props.handleSignOut();
  }

  renderPageBody() {
    // If we have acquired the necessary policies, render desired page
    if (this.state.enterApp) {
      return (
        <>
          <Container style={styles.container}>
            <Container style={styles.tab}>
              <Tab
                style={{ marginBottom: 24 }}
                panes={[
                  {
                    menuItem: {
                      key: 'contacts',
                      icon: 'call',
                      content: 'Contacts(4)',
                    },
                    render: () => (
                      <Tab.Pane>
                        <UserList
                          onClick={(item) => {
                            this.setState({
                              modalOpen: true,
                              modalProps: {
                                title: 'Contacts',
                                subTitle: item.name,
                                description: '',
                                button1:
                                  item.description === 'Requested'
                                    ? {
                                        content: 'Reject',
                                        negative: true,
                                        onClick: () => {
                                          alert('Reject');
                                        },
                                      }
                                    : item.description === 'Pending'
                                    ? {
                                        content: 'Cancel',
                                        negative: true,
                                        onClick: () => {
                                          alert('Cancel');
                                        },
                                      }
                                    : null,
                                button2:
                                  item.description === 'Requested'
                                    ? {
                                        content: 'Accept',
                                        positive: true,
                                        onClick: () => {
                                          alert('Accept');
                                        },
                                      }
                                    : null,
                              },
                            });
                          }}
                          items={[
                            {
                              id: '1',
                              name: 'Lena',
                            },
                            {
                              id: '2',
                              name: 'Lindsay',
                            },
                            {
                              id: '3',
                              name: 'Mark',
                              description: 'Requested',
                            },
                            {
                              id: '4',
                              name: 'Linsy',
                              description: 'Pending',
                            },
                          ]}
                        />
                      </Tab.Pane>
                    ),
                  },
                ]}
              />
              <Tab
                panes={[
                  {
                    menuItem: {
                      key: 'invites',
                      icon: 'talk',
                      content: 'Invites(1)',
                    },
                    render: () => (
                      <Tab.Pane>
                        <UserList
                          onClick={(item) => {
                            this.setState({
                              modalOpen: true,
                              modalProps: {
                                title: 'Invites',
                                subTitle: `${item.name} invites you`,
                                description: item.description,
                                button1: {
                                  content: 'Reject',
                                  negative: true,
                                  onClick: () => {
                                    alert('Reject');
                                  },
                                },
                                button2: {
                                  content: 'Accept',
                                  positive: true,
                                  onClick: () => {
                                    alert('Accept');
                                  },
                                },
                              },
                            });
                          }}
                          items={[
                            {
                              id: '1',
                              name: 'Friend A',
                              description: 'Room No.1',
                            },
                          ]}
                        />
                      </Tab.Pane>
                    ),
                  },
                ]}
              />
            </Container>
            <Container style={styles.room}>
              <Switch>
                <Route path="/app/room/:roomType/:roomName" component={Chat} />
                <Route exact path="/app/rooms" component={Rooms} />
                <Route path="/" component={Rooms} />
              </Switch>
            </Container>
          </Container>
        </>
      );
    }

    // Otherwise display a loading spinner until API calls have succeeded
    return <Route path="/" component={Spinner} />;
  }

  render() {
    const { loggedIn } = this.props;
    if (!loggedIn) {
      return <RootRouter />;
    }

    console.log(this.state.modalProps);

    return (
      <>
        <div>
          <Menu fixed="top">
            <Menu.Item>
              <Link to="/app/rooms">Rooms</Link>
            </Menu.Item>
            <Menu.Item onClick={this.signOut}>Log out</Menu.Item>
          </Menu>
          <div>{this.renderPageBody()}</div>
        </div>

        <Modal
          open={this.state.modalOpen}
          onClose={() => {
            this.setState({
              modalOpen: false,
            });
          }}
          onOpen={() => {
            this.setState({
              modalOpen: true,
            });
          }}
          {...this.state.modalProps}
        />
      </>
    );
  }
}

App.propTypes = {
  handleSignOut: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  loggedInStatusChanged: PropTypes.func.isRequired,
  acquirePublicPolicies: PropTypes.func.isRequired,
  connectPolicy: PropTypes.bool.isRequired,
  publicPublishPolicy: PropTypes.bool.isRequired,
  publicSubscribePolicy: PropTypes.bool.isRequired,
  publicReceivePolicy: PropTypes.bool.isRequired,
  deviceConnected: PropTypes.bool.isRequired,
  deviceConnectedStatusChanged: PropTypes.func.isRequired,
  identityId: PropTypes.string.isRequired,
  attachMessageHandler: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  loggedIn: state.auth.loggedIn,
  connectPolicy: state.iot.connectPolicy,
  publicPublishPolicy: state.iot.publicPublishPolicy,
  publicSubscribePolicy: state.iot.publicSubscribePolicy,
  publicReceivePolicy: state.iot.publicReceivePolicy,
  deviceConnected: state.iot.deviceConnected,
  identityId: state.auth.identityId,
});

const mapDispatchToProps = {
  handleSignOut,
  loggedInStatusChanged,
  acquirePublicPolicies,
  deviceConnectedStatusChanged,
  attachMessageHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
