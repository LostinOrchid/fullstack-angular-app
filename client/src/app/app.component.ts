import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const usersQuery = gql`
  query GetUsers {
    users {
      id
      firstName
      lastName
      age
    }
  }
`;

const createUser = gql`
  mutation createUser($input: createUserInput!) {
    createUser(input: $input) {
      id
      firstName
      lastName
      age
    }
  }
`;

interface User {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
}

interface Response {
  users: User[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'client';

  users = [];

  error = null;

  loading = false;

  form = {
    data: {
      firstName: '',
      lastName: '',
      age: 0,
    },
    submitting: false,
  };

  get formData() {
    return this.form.data;
  }

  constructor(public apollo: Apollo) {}

  ngOnInit() {
    this.apollo
      .watchQuery<Response>({
        query: usersQuery,
      })
      .valueChanges.subscribe(result => {
        this.users = result.data && result.data.users;
        this.loading = result.loading;
        this.error = result.errors;
      });
  }

  onSubmit(e) {
    const input = this.form.data;

    this.form.submitting = true;

    setTimeout(() => {
      this.apollo.mutate({
        mutation: createUser,
        variables: {
          input
        }
      }).subscribe(({ data }) => {
        this.clearForm();
        this.form.submitting = false;
        console.log('got data', data);
      }, (error) => {
        console.log('there was an error sending the query', error);
      });
    }, 2000);
  }

  clearForm() {
    this.form.data = {
      age: 0,
      firstName: '',
      lastName: '',
    };
  }
}
