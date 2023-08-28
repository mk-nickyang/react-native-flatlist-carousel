import {
  StyleSheet,
  SafeAreaView,
  type ListRenderItem,
  View,
  Text,
  ScrollView,
} from 'react-native';
import { Carousel } from 'react-native-flatlist-carousel';

type Item = { id: string; title: string; color: string };

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
    color: '#3f51b5',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
    color: '#673ab7',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
    color: '#2196f3',
  },
];

const keyExtractor = (item: Item) => item.id;

const renderItem: ListRenderItem<Item> = ({ item }) => (
  <View style={[styles.itemContainer, { backgroundColor: item.color }]}>
    <Text style={styles.text}>{item.title}</Text>
  </View>
);

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Carousel
          height={200}
          data={DATA}
          renderCarouselItem={renderItem}
          keyExtractor={keyExtractor}
        />

        <View style={styles.space} />

        <Carousel
          height={200}
          data={DATA}
          renderCarouselItem={renderItem}
          keyExtractor={keyExtractor}
          autoScrollInterval={3000}
        />

        <View style={styles.space} />

        <Carousel
          height={200}
          data={DATA}
          renderCarouselItem={renderItem}
          keyExtractor={keyExtractor}
          autoScrollInterval={3000}
          showDots
          dotOptions={{ selectedFillColor: '#2196f3' }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  space: {
    height: 40,
  },
  text: {
    color: '#ffffff',
  },
});
