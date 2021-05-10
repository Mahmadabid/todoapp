import React, { useState } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Button, List, useMediaQuery } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useSelector } from "react-redux";
import { State } from "../Global/Types/SliceTypes";
import Task from "../components/Task";
// import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      width: '30ch',
    },
    button: {
      marginLeft: '15px',
    },
    root: {
      width: '100%',
      minWidth: 380,
      backgroundColor: theme.palette.background.paper,
    },
    rootQuery: {
      width: '100%',
      minWidth: 305,
      backgroundColor: theme.palette.background.paper,
    },
    list: {
      marginTop: '10px',
      marginLeft: '10px',
    },
    LightList: {
      backgroundColor: 'hsl(227deg 100% 97%)',
    },
  }),
);


// This query is executed at run time by Apollo.
export const GET_TODO = gql`
{
  todos {
    task,
    status,
    id,
    date,
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

interface Info {
  id: string
  status: boolean
  task: string
  date: string
}

const IndexPage = () => {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_TODO);
  const islit = useSelector((state: State) => state.themes.value);
  const matches = useMediaQuery('(max-width:380px)');
  const [value, setValue] = useState("");
  const [AddTodo] = useMutation(ADD_TODO);
  // const [isLoading, setLoading] = useState(false);

  const AddTask = (event: React.FormEvent) => {
    event.preventDefault();
    AddTodo({
      variables: {
        task: value
      },
      refetchQueries: [{ query: GET_TODO }]
    })
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

  // const Load = () => {
  //   return (
  //     <div className="loading">
  //       <CircularProgress />
  //     </div>
  //   )
  // }
  if (data) {
    return (
      <Layout>
        <SEO title="Home" />
        <form onSubmit={AddTask}>
          <div className="main">
            <TextField className={classes.input} onChange={(e) => setValue(e.target.value)} value={value} id="outlined-basic" label="Add Task" variant="outlined" />
            <Button type="submit" className={`button ${classes.button}`} variant="contained" color="primary">ADD TASK</Button>
          </div>
        </form>
        { data.todos && data.todos.map((info: Info, index: number) =>
          <List key={index} className={`${matches ? classes.rootQuery : classes.root} ${classes.list} ${islit ? classes.LightList : ''} `}>
            <Task date={info.date} task={info.task} id={info.id} status={info.status} />
          </List>
        )
        }
      </Layout >
    );
  }
}

export default IndexPage
