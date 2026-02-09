export interface Hymn {
  number: number;
  title: string;
  /** Full lyrics; used when verses is not provided (split by double newline for display). */
  lyrics?: string;
  /** Section or chapter title (e.g. "13 Eelku lyAayapuki"). */
  sectionTitle?: string;
  /** Composer/author (e.g. "G. Lewenhaupt"). */
  author?: string;
  /** Year (e.g. "1862"). */
  year?: string;
  /** Solfa/tonic sol-fa notation as plain text. */
  notation?: string;
  /** Numbered verses; if present, shown as "1. ...", "2. ...". */
  verses?: string[];
  /** Bottom attribution block (e.g. "ONGOWELA NIITYA: Gustav Lewenhaupt 1862 (1855) ..."). */
  attribution?: string;
  /** Reference (e.g. "OMA 131"). */
  reference?: string;
}
