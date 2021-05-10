import React from 'react'
import Layout from '../components/layout';
import SEO from '../components/seo';

const index = () => {
  return (
    <Layout>
      <SEO title="Home" />
      <div>
        <h1>TODO APP is made to capture Todos and Edit them.</h1>
        <p>Make sure you LogIn before creating them</p>
      </div>
    </Layout>
  )
}

export default index;