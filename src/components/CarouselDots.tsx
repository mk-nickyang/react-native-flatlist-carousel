import { useState, forwardRef, useImperativeHandle, type Ref } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { View } from 'react-native';

export type DotOptions = {
  size?: number;
  fillColor?: string;
  selectedFillColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

type CarouselDotsProps = {
  initialIndex: number;
  dataLength: number;
  dotOptions?: DotOptions;
};

type CarouselDotsRef = {
  setSelectedDotIndex: (newIndex: number) => void;
};

export const CarouselDots = forwardRef(
  (
    { initialIndex, dataLength, dotOptions }: CarouselDotsProps,
    ref: Ref<CarouselDotsRef>
  ) => {
    const [selectedDotIndex, setSelectedDotIndex] = useState(initialIndex);

    useImperativeHandle(ref, () => ({
      setSelectedDotIndex,
    }));

    return (
      <View style={[styles.container, dotOptions?.containerStyle]}>
        {[...Array(dataLength)].map((_, index) => (
          <Dot
            key={index}
            isSelected={index === selectedDotIndex}
            {...dotOptions}
          />
        ))}
      </View>
    );
  }
);

type DotProps = DotOptions & { isSelected: boolean };

const Dot = ({
  size = 5,
  fillColor = '#bdbdbd',
  selectedFillColor = '#000000',
  isSelected,
  style,
}: DotProps) => {
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size,
          marginHorizontal: size / 2,
          backgroundColor: isSelected ? selectedFillColor : fillColor,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    marginTop: 10,
  },
});
