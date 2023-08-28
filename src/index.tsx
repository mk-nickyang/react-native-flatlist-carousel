import { useCallback, useEffect, useRef, type ElementRef } from 'react';
import {
  useWindowDimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { View } from 'react-native';
import {
  FlatList,
  type FlatListProps,
  type ListRenderItem,
} from 'react-native';

import { useEvent } from './hooks/useEvent';
import { CarouselDots, type DotOptions } from './components/CarouselDots';

type PaginationFlatListProps<ItemT> = Omit<
  FlatListProps<ItemT>,
  | 'horizontal'
  | 'showsHorizontalScrollIndicator'
  | 'pagingEnabled'
  | 'renderItem'
  | 'style'
>;

export interface CarouselProps<ItemT> extends PaginationFlatListProps<ItemT> {
  // Custom carousel Item
  height: number;
  itemWidth?: number;
  renderCarouselItem?: FlatListProps<ItemT>['renderItem'];
  carouselItemStyle?: StyleProp<ViewStyle>;
  // FlatList
  renderItem?: FlatListProps<ItemT>['renderItem'];
  listStyle?: FlatListProps<ItemT>['style'];
  // Auto scroll
  autoScrollInterval?: number;
  // Dots
  showDots?: boolean;
  dotOptions?: DotOptions;
  // Container
  style?: StyleProp<ViewStyle>;
}

export const Carousel = <ItemT extends any>({
  // Custom carousel Item
  height,
  itemWidth,
  renderCarouselItem,
  carouselItemStyle,
  // FlatList
  renderItem: defaultRenderItem,
  onScrollToIndexFailed: defaultOnScrollToIndexFailed,
  onScrollBeginDrag: defaultOnScrollBeginDrag,
  onScrollEndDrag: defaultOnScrollEndDrag,
  onMomentumScrollEnd: defaultOnMomentumScrollEnd,
  listStyle,
  // Auto scroll
  autoScrollInterval,
  // Dots
  showDots,
  dotOptions,
  // Container
  style,
  // Rest FlatList props
  ...flatListProps
}: CarouselProps<ItemT>) => {
  const flatListRef = useRef<FlatList | null>(null);
  const autoScrollIndexRef = useRef(flatListProps.initialScrollIndex ?? 0);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout>();
  const carouselDotsRef = useRef<ElementRef<typeof CarouselDots>>(null);

  const { width: windowWidth } = useWindowDimensions();

  // Default to window width
  const carouselItemWidth = itemWidth ?? windowWidth;

  const isAutoScrollEnabled = !!autoScrollInterval;

  const renderItem: ListRenderItem<ItemT> = useCallback(
    (info) => {
      return (
        <View style={[{ width: carouselItemWidth, height }, carouselItemStyle]}>
          {renderCarouselItem ? renderCarouselItem(info) : null}
        </View>
      );
    },
    [renderCarouselItem, carouselItemWidth, height, carouselItemStyle]
  );

  const handleAutoScroll = useEvent(() => {
    if (!flatListProps.data?.length) return;
    // If at the end, loop back to the beginning; otherwise, scroll to the next index
    const newIndex =
      autoScrollIndexRef.current >= flatListProps.data.length - 1
        ? 0
        : autoScrollIndexRef.current + 1;
    // Scroll to the next index
    flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    // Update index ref
    autoScrollIndexRef.current = newIndex;
    // Update selected dot
    if (showDots) {
      carouselDotsRef.current?.setSelectedDotIndex(newIndex);
    }
  });

  const setupAutoScroll = useCallback(() => {
    if (autoScrollInterval) {
      autoScrollIntervalRef.current = setInterval(
        handleAutoScroll,
        autoScrollInterval
      );
    }
  }, [autoScrollInterval, handleAutoScroll]);

  const pauseAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }
  }, []);

  useEffect(() => {
    setupAutoScroll();

    return () => {
      pauseAutoScroll();
    };
  }, [pauseAutoScroll, setupAutoScroll]);

  const onScrollToIndexFailed = useCallback(
    (info) => {
      if (isAutoScrollEnabled) {
        flatListRef.current?.scrollToIndex({ index: 0 });
      }
      defaultOnScrollToIndexFailed?.(info);
    },
    [isAutoScrollEnabled, defaultOnScrollToIndexFailed]
  );

  const onScrollBeginDrag = useCallback(
    (event) => {
      if (isAutoScrollEnabled) {
        pauseAutoScroll();
      }
      defaultOnScrollBeginDrag?.(event);
    },
    [defaultOnScrollBeginDrag, isAutoScrollEnabled, pauseAutoScroll]
  );

  const onScrollEndDrag = useCallback(
    (event) => {
      if (isAutoScrollEnabled) {
        setupAutoScroll();
      }
      defaultOnScrollEndDrag?.(event);
    },
    [defaultOnScrollEndDrag, isAutoScrollEnabled, setupAutoScroll]
  );

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isAutoScrollEnabled) {
        const {
          nativeEvent: {
            contentOffset: { x },
            layoutMeasurement: { width },
          },
        } = event;

        const newIndex = Math.floor(x / width);

        if (autoScrollIndexRef.current !== newIndex) {
          // Update index ref
          autoScrollIndexRef.current = newIndex;
          // Update selected dot
          if (showDots) {
            carouselDotsRef.current?.setSelectedDotIndex(newIndex);
          }
        }
      }
      defaultOnMomentumScrollEnd?.(event);
    },
    [defaultOnMomentumScrollEnd, isAutoScrollEnabled, showDots]
  );

  return (
    <View style={style}>
      <FlatList
        {...flatListProps}
        ref={flatListRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        renderItem={defaultRenderItem || renderItem}
        onScrollToIndexFailed={onScrollToIndexFailed}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={listStyle}
      />

      {showDots ? (
        <CarouselDots
          ref={carouselDotsRef}
          initialIndex={flatListProps.initialScrollIndex ?? 0}
          dataLength={flatListProps.data?.length ?? 0}
          dotOptions={dotOptions}
        />
      ) : null}
    </View>
  );
};
