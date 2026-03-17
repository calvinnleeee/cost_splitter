import { useTheme } from '@/context/theme-context';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'bold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const { themeColors } = useTheme();

  return (
    <Text
      style={[
        {
          color: themeColors.text,
          fontFamily: ['default', 'subtitle', 'link'].includes(type) ? 'Montserrat' : 'MontserratBold',
          letterSpacing: -0.3,
        },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'bold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 14,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 14,
    lineHeight: 24,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 18,
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
    color: '#0a7ea4',
  },
});
