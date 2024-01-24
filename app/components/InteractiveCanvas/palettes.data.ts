export type Color = string
export type Palette = [Color, Color, Color, Color, Color]
export const PALETTES: ReadonlyArray<Palette> = [
  ['#C0F', '#F0C', '#0CF', '#0FC', '#FF0'],
  ['#333', '#666', '#999', '#CCC', '#FFF'],
  ['#305', '#606', '#907', '#C08', '#F09'],
  ['#036', '#067', '#098', '#0C9', '#0FA'],
  ['#361D32', '#543C52', '#F55951', '#EDD2CB', '#F1E8E6'],
  ['#B1AE91', '#b76e79', '#804D5A', '#B76EAF', '#804D7A'],
  ['#020887', '#334195', '#647aa3', '#95b2b0', '#c6ebbe'],
  ['#8783d1', '#aa9aba', '#bfa4a4', '#d1abad', '#e3b9bc'],
  ['#b47eb3', '#fdf5bf', '#ffd5ff', '#92d1c3', '#8bb8a8'],
  ['#d81159', '#8f2d56', '#218380', '#fbb13c', '#73d2de'],
  ['#2c4251', '#c1c1c1', '#d16666', '#b6c649', '#870058'],
  ['#586ba4', '#324376', '#f5dd90', '#f68e5f', '#f76c5e'],
  ['#DA3E52', '#092327', '#00a9a5', '#4e8098', '#90c2e7'],
  ['#2f4858', '#336699', '#86bbd8', '#9ee493', '#daf7dc'],
  ['#561643', '#6c0e23', '#c42021', '#EAC435', '#f3ffb9'],
  ['#a09abc', '#b6a6ca', '#d5cfe1', '#e1dee9', '#d4bebe'],
  ['#0c090d', '#e01a4f', '#f15946', '#f9c22e', '#53b3cb'],
  ['#3b0d11', '#6a3937', '#706563', '#748386', '#9dc7c8'],
  ['#ee6055', '#60d394', '#aaf683', '#ffd97d', '#ff9b85'],
  ['#293f14', '#386c0b', '#38a700', '#31d843', '#3eff8b'],
  ['#232020', '#553739', '#955e42', '#9c914f', '#748e54'],
  ['#466365', '#b49a67', '#ceb3ab', '#c4c6e7', '#baa5ff'],
  ['#390099', '#9e0059', '#ff0054', '#ff5400', '#ffbd00'],
  ['#042a2b', '#5eb1bf', '#cdedf6', '#ef7b45', '#d84727'],
  ['#60463b', '#ffcad4', '#b0d0d3', '#c08497', '#f7af9d'],
  ['#beb8eb', '#5299d3', '#0b5563', '#5e5c6c', '#a2bce0'],
  ['#122C91', '#2A6FDB', '#48D6D2', '#81E9E6', '#FEFCBF'],
  ['#1F306E', '#80A1C1', '#8F3B76', '#C7417B', '#F5487F'],
  ['#454D66', '#309975', '#58B368', '#DAD873', '#EFEEB4'],
  ['#00A0B0', '#6A4A3C', '#CC333F', '#EB6841', '#EDC951'],
  ['#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51'],
  ['#300018', '#5A3D31', '#837B47', '#ADB85F', '#E5EDB8'],
  ['#343838', '#005F6B', '#008C9E', '#00B4CC', '#00DFFC'],
  ['#3FB8AF', '#7FC7AF', '#DAD8A7', '#FF9E9D', '#FF3D7F'],
  ['#413E4A', '#73626E', '#B38184', '#F0B49E', '#F7E4BE'],
  ['#452632', '#91204D', '#E4844A', '#E8BF56', '#E2F7CE'],
  ['#594F4F', '#547980', '#45ADA8', '#9DE0AD', '#E5FCC2'],
  ['#5D4157', '#838689', '#A8CABA', '#CAD7B2', '#EBE3AA'],
  ['#81657E', '#3EA3AF', '#9FD9B3', '#F0F6B9', '#d7b49e'],
  ['#12355B', '#BDA2A2', '#FBBE9A', '#FAD889', '#FAF5C8'],
  ['#2A363B', '#E84A5F', '#FF847C', '#FECEA8', '#99B898'],
  ['#AB526B', '#BCA297', '#C5CEAE', '#F0E2A4', '#F4EBC3'],
  ['#390D2D', '#FE4B74', '#EDAD9E', '#E1EAB5', '#ACDEB2'],
  ['#7B3B3B', '#493736', '#2A2829', '#668284', '#B9D7D9'],
  ['#2C4251', '#CCC68D', '#EEDD99', '#EEC290', '#EEAA88'],
  ['#0B486B', '#3B8686', '#79BD9A', '#A8DBA8', '#CFF09E'],
  ['#F56991', '#FF9F80', '#FFC48C', '#EFFAB4', '#D1F2A5'],
  ['#68B3AF', '#87BDB1', '#AACCB1', '#C3DBB4', '#D3E2B6'],
  ['#F23C55', '#2A2F36', '#31797D', '#61C791', '#E0FFB3'],
  ['#384252', '#C0EFD2', '#FFFFDD', '#E9D6AF', '#E25858'],
  ['#E8608C', '#71CBC4', '#FFF9F4', '#CDD56E', '#FFBD68'],
  ['#031634', '#033649', '#036564', '#CDB380', '#E8DDCB'],
  ['#E94E77', '#D68189', '#C6A49A', '#C6E5D9', '#F4EAD5'],
  ['#36393B', '#45484B', '#696758', '#C5BC8E', '#EEE6AB'],
  ['#99173C', '#2E2633', '#555152', '#DCE9BE', '#EFFFCD'],
  ['#F04155', '#FF823A', '#F2F26F', '#FFF7BD', '#95CFB7'],
  ['#355C7D', '#6C5B7B', '#C06C84', '#F67280', '#F8B195'],
  ['#816E94', '#E98977', '#F2B4A8', '#F4DEC2', '#F8F4D7'],
  ['#3B8183', '#ED303C', '#F5634A', '#FF9C5B', '#FAD089'],
  ['#FE4365', '#FC9D9A', '#F9CDAD', '#C8C8A9', '#83AF9B'],
  ['#FF4E50', '#FC913A', '#F9D423', '#EDE574', '#E1F5C4'],
  ['#341139', '#3C3251', '#359668', '#A8D46F', '#FFED90'],
  ['#c11b0a', '#7c2247', '#1a845d', '#fd6052', '#8cdbd0'],
  ['#bcb5a2', '#ba948e', '#755352', '#af6b89', '#6c557f'],
  ['#48413f', '#595858', '#898989', '#c6c3c0', '#fdfdfd'],
  ['#000a6d', '#003553', '#00b574', '#0884a4', '#20ff91'],
  ['#3f1f49', '#3e2c3a', '#fd5142', '#f8ecef', '#edeae0'],
  ['#001b58', '#3e6b8f', '#716a9f', '#82a9a4', '#eff8e2'],
  ['#005568', '#014b4f', '#006a42', '#04f467', '#00e29a'],
  ['#000699', '#6032ad', '#8b7abd', '#a4c0b7', '#c3e89b'],
  ['#004ca5', '#4a2d7a', '#6e8e9d', '#a7c2c5', '#c5e8cf'],
  ['#c32d0a', '#6f332d', '#2e8e67', '#f1cf25', '#5fbad1'],
]
