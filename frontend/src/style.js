import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Button = styled.button`
background: Bisque;
font-size: 1em;
margin: 0.5em;
padding: 0.5em;
`
const Page = styled.div`
  padding: 1em;
  background: papayawhip;
`

const Navigation = styled.div`
  background: BurlyWood;
  padding: 1em;
`

const Footer = styled.div`
  background: Chocolate;
  padding: 1em;
  margin-top: 1em;
`
const StyledLink = styled(Link)`
  text-decoration: none;
  padding: 1em;
  &:visited{
    color: gray;
  };
  &:hover{
    color: orange;
    font-size: 1.2em;
  };
`
const BlogList = styled.div`
  padding: 0.5em;
`

export { Button, Page, Navigation, Footer, StyledLink, BlogList }