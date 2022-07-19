import { Flex, FlexProps, SimpleGrid } from '@chakra-ui/layout';
import ImportLectures from '../features/importLectures/ImportLectures';
import AddLectureButton from '../features/lectures/AddLectureButton';
import ColorModeSwitcher from './ColorModeSwitcher';
// import CopyUrlButton from './CopyUrlButton';
import Logo from './Logo';

export default function Header(props: FlexProps = {}) {
  return (
    <Flex {...props} my={2} w="100%" justifyContent="space-between" px={{md: 20}} alignItems="center">
      <Logo maxHeight="5em"/>
      <SimpleGrid columns={1} gap={2}>
        <ColorModeSwitcher />
        <ImportLectures/>
        {/* <CopyUrlButton allLectures={allLectures} options={options} averageBonus={averageBonus}/> */}
        <AddLectureButton />
      </SimpleGrid>
    </Flex>
  );
}
