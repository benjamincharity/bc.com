export interface SkeletonInstanceThemeObject {
  title: SkeletonTheme;
  description: SkeletonTheme;
}

export interface SkeletonInstanceThemeArrayObject {
  title: SkeletonTheme;
  description: SkeletonTheme[];
}

export interface SkeletonTheme {
  'height.px'?: number;
  'width'?: string;
}

export const skeletonArticleListingSizes: SkeletonInstanceThemeObject = {
  title: {
    'height.px': 40,
    'width': '100%',
  },
  description: {
    'height.px': 22,
    'width': '70%',
  },
};

export const skeletonArticleSizes: SkeletonInstanceThemeArrayObject = {
  title: {
    'height.px': 40,
    'width': '60%',
  },
  description: [
    {
      'height.px': 16,
      'width': '85%',
    },
    {
      'height.px': 16,
      'width': '100%',
    },
    {
      'height.px': 16,
      'width': '70%',
    },
  ],
};
