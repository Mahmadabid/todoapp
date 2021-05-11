import React, { useContext } from 'react';
import { IdentityContext } from "../../netlifyIdentityContext";
import TaskBox from '../components/TaskBox';
import Layout from '../components/layout';
import SEO from '../components/seo';
import LogInButton from '../components/Login';
import { Router } from "@reach/router";

const LoggedOut = () => {

  return (
    <Layout>
      <SEO title="Home" />
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <h1>Oops!</h1>
        <p>You are not logged In.</p>
        <p>LogIn to create Todos</p>
        <LogInButton />
      </div>
    </Layout>
  )
}

const todo = () => {
  const { user } = useContext(IdentityContext);
  if (!user) {
    return (
      <Router>
        <LoggedOut path="/todo" />
      </Router>
    );
  }
  else {
    return (
      <TaskBox />
    )
  }
}

export default todo;