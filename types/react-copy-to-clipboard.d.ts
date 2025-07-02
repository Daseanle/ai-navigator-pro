declare module 'react-copy-to-clipboard' {
  import * as React from 'react';

  export interface CopyToClipboardOptions {
    debug?: boolean;
    message?: string;
    format?: string; // 'text/html' | 'text/plain'
    onCopy?: (text: string, result: boolean) => void;
  }

  export interface CopyToClipboardProps extends CopyToClipboardOptions {
    text: string;
    children: React.ReactElement;
  }

  export class CopyToClipboard extends React.Component<CopyToClipboardProps> {}
}