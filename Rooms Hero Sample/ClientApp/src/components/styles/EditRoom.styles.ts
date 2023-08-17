import { IStackTokens, mergeStyles } from "@fluentui/react";

export const tableStyle = mergeStyles({
  borderCollapse: 'collapse',
});

export const cellStyle = mergeStyles({
    border: '1px solid #ddd',
    padding: '0.2rem'
});

export const inputTokens: IStackTokens = {
  childrenGap: '3.4375rem'
};

export const buttonStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '0.875rem', // 14px
  height: '2.0rem',
  borderRadius: 3,
  padding: '0.625rem',
  margin: "0.3rem"
});


export const gridBbuttonStyle = mergeStyles({
    fontWeight: 400,
    fontSize: '0.875rem', // 14px
    height: '2.0rem',
    borderRadius: 3,
    padding: '0.625rem',
});