import React, { useContext } from 'react';
import { IdentityContext } from "../../netlifyIdentityContext";
import TaskBox from '../components/TaskBox';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { Button } from '@material-ui/core';

interface TodoProps {
  netlifyIdentity: {}
}

const LoggedOut = ({netlifyIdentity}: TodoProps) => {
  
  return (
    <Layout>
      <SEO title="Home" />
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <h1>Oops!</h1>
        <p>You are not logged In.</p>
        <p>LogIn to create Todos</p>
        <Button color="primary" variant="contained" onClick={() => { netlifyIdentity.open() }}>LogIn</Button>
      </div>
    </Layout>
  )
}

const todo = () => {
  const { user, identity: netlifyIdentity } = useContext(IdentityContext);
  if (!user) {
    return (
        <LoggedOut netlifyIdentity={netlifyIdentity} />
    );
  }
  return (
    <TaskBox />
  )
}

export default todo;