import React, {useContext} from 'react'
import Layout from '../components/layout';
import SEO from '../components/seo';
import { IdentityContext } from "../../netlifyIdentityContext";
import { Link } from 'gatsby';
import { Button } from '@material-ui/core';

const index = () => {
  const { user } = useContext(IdentityContext);

  if (!user) {
  return (
    <Layout>
      <SEO title="Home" />
      <div>
        <h4>TODO APP is made to capture Todos and Edit them.</h4>
        <p>Make sure you LogIn before creating them</p>
      </div>
    </Layout>
  )
  }
  return (
    <Layout>
      <SEO title="Home" />
    <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
      <h1>Welcome {user.user_metadata.full_name}</h1>
      <Link to="todo" style={{textDecoration: 'none'}} >
        <Button color="primary" variant="contained">Create Todo</Button>
      </Link>
    </div>
    </Layout>
  )
}

export default index;