import { SimpleGrid, SimpleGridProps } from '@chakra-ui/layout';
import React from 'react';
import { DragDropContext, DragStart, Droppable, DropResult, ResponderProvided } from 'react-beautiful-dnd';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { borderColor } from '../../theme';
import Lecture from './Lecture';
import { reorderLectures, selectLectures } from './lectureDuck';

function LectureTable(props: SimpleGridProps) {

  const lectures = useAppSelector(selectLectures)
  const dispatch = useAppDispatch()

  const onDragStart = (initial: DragStart, provided: ResponderProvided) => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  }
  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    if (!result.destination) {
      return
    }
    if (result.source.index === result.destination.index) {
      return
    }
    dispatch(reorderLectures({ start: result.source.index, end: result.destination.index }))
  }

  return (
    <SimpleGrid
      display="inline-block"
      border="1px"
      borderColor={borderColor}
      borderRadius="md"
      columns={1}
      rowGap={5}
      justifyItems="center"
      overflowY="auto"
      maxHeight={{ base: '50vh', md: '60vh', xl: '75vh' }}
      overflowX="clip"
      css={{
        '&::-webkit-scrollbar': {
          width: '2px',
        },
        '&::-webkit-scrollbar-track': {
          width: '2px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#888888FF',
          borderRadius: '20px',
        },
      }}
      {...props}
    >

      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <Droppable droppableId='lectureTable'>
          {(droppableProvided, droppableSnapshot) =>
            <div ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
              {lectures.map((lecture, index) => (

                <Lecture
                  key={lecture._id}
                  lectureId={lecture._id}
                  index={index}
                />
              )
              )}
              {droppableProvided.placeholder}
            </div>
          }
        </Droppable>
      </DragDropContext>
    </SimpleGrid>
  );
}

export default React.memo(LectureTable);
