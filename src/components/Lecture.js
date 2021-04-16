import React from 'react';
import { Text, Button, Checkbox, Grid } from '@chakra-ui/react';

export default function Lecture({ allLectures, setLectures, lecture }) {
  return
    <Grid row={1} templateColumns="1fr 3fr 1fr 1fr">
    <Checkbox></Checkbox>
    <Text> {lecture.name} </Text>
    <Text> {lecture.cfu} </Text>
    <Text> {lecture.grade} </Text>
  </Grid>;
}
