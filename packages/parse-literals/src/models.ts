export interface TemplatePart {
  end: number;
  start: number;
  text: string;
}

export interface Template {
  parts: TemplatePart[];
  tag?: string;
}
