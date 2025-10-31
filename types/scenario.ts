export interface Timestamp {
  time: string;
  narrative: string;
  thinking: string;
  feeling: string;
  action: string;
  momentOfValue: string;
  quote?: string;
}

export interface Scenario {
  company: string;
  slug: string;
  title: string;
  persona: string;
  scenario: string;
  worstCase: string;
  timestamps: Timestamp[];
}
