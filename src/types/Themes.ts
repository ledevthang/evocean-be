export type ThemeMedia = {
  pages?: string[];
  format?: string[];
  previews: string[];
  categories?: string[];
  highlight?: string[];
  live_preview?: string;
  template_features?: string[];
  figma_features?: string[];
  thumbnail?: string;
};

export interface IUpdateThemeData {
  categories: string[] | undefined;
  tags: string[] | undefined;
}
