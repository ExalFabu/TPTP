import { Button } from '@chakra-ui/button';
import React from 'react';

const urlToClipboard = allLectures => {
  const basename = window.location.origin;
  const path = '?lectures=' + encodeURIComponent(JSON.stringify(allLectures));
  const url = basename + path;
  navigator.clipboard.writeText(url);
  // window.history.replaceState(null, null, path);
};


export default function AddLectureButton({ allLectures }) {

  return (
    <Button leftIcon={<LinkIcon />} onClick={() => urlToClipboard(allLectures)}>
      Copia URL
    </Button>
  );
}
