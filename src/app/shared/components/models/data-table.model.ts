export interface DataTableColumn {
  field: string;
  header: string;
  headerAlign?: 'left' | 'center' | 'right';
  bodyAlign?: 'left' | 'center' | 'right';
  width?: string;
}
