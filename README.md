# react-native-flatlist-carousel

A simple carousel component for React Native using FlatList

https://github.com/mk-nickyang/react-native-flatlist-carousel/assets/29244509/5df4fb92-96e5-40f2-a6e5-38ca22806ca2

## Features
- **Pure JavaScript Implementation**
- **Auto Scroll**
- **Dot Indicators**

More to come in the future.

## Installation

```sh
npm install react-native-flatlist-carousel
```

## Usage

```jsx
import { Carousel } from 'react-native-flatlist-carousel';

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
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: item.color,
    }}
  >
    <Text style={{ color: '#ffffff' }}>{item.title}</Text>
  </View>
);

export default function App() {
  return (
    <Carousel
      height={200}
      data={DATA}
      renderCarouselItem={renderItem}
      keyExtractor={keyExtractor}
      autoScrollInterval={3000}
      showDots
      dotOptions={{ selectedFillColor: '#2196f3' }}
    />
  );
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
