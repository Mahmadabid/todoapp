import * as React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Button } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useRef } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      width: '30ch',
    },
    button: {
      marginLeft: '15px',
    }
  }),
);


// This query is executed at run time by Apollo.
const GET_TODO = gql`
{
  todos {
    task,
    status,
    id
  }
}
`;

const ADD_TODO = gql`
  mutation addTodo($task: String!) {
    addTodo(task: $task) {
      task
    }
  }
`;

const IndexPage = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_TODO);
  const [value, setValue] = React.useState("")
  const [AddTodo] = useMutation(ADD_TODO);

  const AddTask = (event: any) => {
    event.preventDefault();
    AddTodo({
      variables: {
        task: value
      },
      refetchQueries: [{ query: GET_TODO }]
    });
    setValue('');
  }

  if (loading) {
    return (
      <Layout>
        <SEO title="Home" />
        <h1>Loading...</h1>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <SEO title="Home" />
        <h3>Error, Please try again later</h3>
      </Layout>
    );
  }

  if (data) {
    return (
      <Layout>
        <SEO title="Home" />
        <form onSubmit={AddTask}>
          <div className="main">
            {console.log(data)}
            <TextField className={classes.input} onChange={(e) => setValue(e.target.value)} id="outlined-basic" label="Outlined" variant="outlined" />
            <Button type="submit" className={`button ${classes.button}`} variant="contained" color="primary">ADD TASK</Button>
          </div>
        </form>
      </Layout>
    );
  }
}

export default IndexPage
