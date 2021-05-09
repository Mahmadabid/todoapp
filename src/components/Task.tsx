import React from 'react';
import { IconButton, ListItem, ListItemText } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import EditIcon from '@material-ui/icons/Edit';

interface TaskProps {
    task: string
    id: any
    status: boolean
    GET_TODO: any,
    date: string
}

const DEL_TODO = gql`
  mutation delTodo($id: ID!) {
    delTodo(id: $id) {
      id
    }
  }
`;

const CHECK_TODO = gql`
    mutation checkTodo($id: ID!, $status: Boolean!) {
        checkTodo(id: $id, status: $status) {
            id,
            status
        }
    }
`;

const UPDATE_TODO = gql`
    mutation UpdateTodo($id: ID!, $task: String!) {
        updateTodo(id: $id, task: $task) {
            id,
            task
        }
    }
`;

const Task: React.FC<TaskProps> = ({ task, id, status, GET_TODO, date }) => {

    const [delTodo] = useMutation(DEL_TODO);
    const [checkTodo] = useMutation(CHECK_TODO);
    const [updateTodo] = useMutation(UPDATE_TODO);

    const DelTask = () => {
        delTodo({
            variables: {
              id,
            },
            refetchQueries: [{ query: GET_TODO }],
          });
    }

    const CheckTask = () => {
        status = !status
        checkTodo({
            variables: {
              id,
              status
            },
            refetchQueries: [{ query: GET_TODO }],
          });
    }

    const UpdateTask = () => {
        const value = prompt("Enter new name")
        updateTodo({
            variables: {
              id,
              task: value
            },
            refetchQueries: [{ query: GET_TODO }],
          });
    }

    return (
        <ListItem>
            <IconButton onClick={CheckTask} color="inherit">
                {status ? <Favorite color="primary" /> : <FavoriteBorder />}
            </IconButton>
            <ListItemText primary={task} secondary={date}/>
            <EditIcon style={{marginRight: '20px'}} onClick={UpdateTask}/>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={true}
                        onChange={DelTask}
                        name="checked"
                        indeterminate
                    />
                }
                label=""
            />

        </ListItem>
    )
}

export default Task;