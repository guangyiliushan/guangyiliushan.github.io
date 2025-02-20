import { gql } from '@apollo/client'

export const GET_POSTS = gql`
  query GetPosts($page: Int!, $perPage: Int!) {
    posts(page: $page, perPage: $perPage) {
      id
      title
      excerpt
      createdAt
    }
    totalPosts
  }
`

export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      createdAt
      author {
        name
      }
    }
  }
`
