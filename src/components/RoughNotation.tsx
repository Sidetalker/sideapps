'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { annotate } from 'rough-notation';
import type {
  RoughAnnotation,
  RoughAnnotationConfig,
} from 'rough-notation/lib/model';

type RoughNotationElement = 'span';

export type RoughNotationProps = {
  children: ReactNode;
  customElement?: RoughNotationElement;
  show?: boolean;
  animationDelay?: number;
  getAnnotationObject?: (annotation: RoughAnnotation) => void;
} & Pick<
  RoughAnnotationConfig,
  | 'animate'
  | 'animationDuration'
  | 'brackets'
  | 'color'
  | 'iterations'
  | 'multiline'
  | 'padding'
  | 'strokeWidth'
  | 'type'
> &
  HTMLAttributes<HTMLSpanElement>;

const DEFAULT_OPTIONS: Required<
  Pick<
    RoughAnnotationConfig,
    'animate' | 'animationDuration' | 'iterations' | 'multiline' | 'padding' | 'strokeWidth'
  >
> = {
  animate: true,
  animationDuration: 800,
  iterations: 2,
  multiline: false,
  padding: 5,
  strokeWidth: 1,
};

export function RoughNotation({
  animate = DEFAULT_OPTIONS.animate,
  animationDelay = 0,
  animationDuration = DEFAULT_OPTIONS.animationDuration,
  brackets,
  children,
  color,
  customElement = 'span',
  getAnnotationObject,
  iterations = DEFAULT_OPTIONS.iterations,
  multiline = DEFAULT_OPTIONS.multiline,
  padding = DEFAULT_OPTIONS.padding,
  show = false,
  strokeWidth = DEFAULT_OPTIONS.strokeWidth,
  type,
  ...rest
}: RoughNotationProps) {
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const annotationRef = useRef<RoughAnnotation | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const options = useMemo<RoughAnnotationConfig>(
    () => ({
      animate,
      animationDuration,
      brackets,
      color,
      iterations,
      multiline,
      padding,
      strokeWidth,
      type,
    }),
    [animate, animationDuration, brackets, color, iterations, multiline, padding, strokeWidth, type],
  );

  const clearScheduledShow = useCallback(() => {
    if (timeoutRef.current !== null && typeof window !== 'undefined') {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const hideAnnotation = useCallback(() => {
    annotationRef.current?.hide();
    clearScheduledShow();
  }, [clearScheduledShow]);

  const showAnnotation = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (timeoutRef.current === null) {
      timeoutRef.current = window.setTimeout(() => {
        annotationRef.current?.show();
        timeoutRef.current = window.setTimeout(() => {
          timeoutRef.current = null;
        }, animationDuration);
      }, animationDelay);
    }
  }, [animationDelay, animationDuration]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    annotationRef.current = annotate(element, options);

    if (getAnnotationObject && annotationRef.current) {
      getAnnotationObject(annotationRef.current);
    }

    return () => {
      clearScheduledShow();
      annotationRef.current?.remove();
      annotationRef.current = null;
    };
  }, [clearScheduledShow, getAnnotationObject, options]);

  useEffect(() => {
    if (!annotationRef.current) return;
    annotationRef.current.animate = options.animate;
    annotationRef.current.animationDuration = options.animationDuration;
    if (options.color) {
      annotationRef.current.color = options.color;
    }
    if (options.strokeWidth !== undefined) {
      annotationRef.current.strokeWidth = options.strokeWidth;
    }
    if (options.padding !== undefined) {
      annotationRef.current.padding = options.padding;
    }
  }, [options]);

  useEffect(() => {
    if (!annotationRef.current) return;
    if (show) {
      showAnnotation();
    } else {
      hideAnnotation();
    }
  }, [hideAnnotation, show, showAnnotation]);

  const CustomElement = customElement as RoughNotationElement;

  return (
    <CustomElement {...rest} ref={elementRef}>
      {children}
    </CustomElement>
  );
}

export default RoughNotation;
