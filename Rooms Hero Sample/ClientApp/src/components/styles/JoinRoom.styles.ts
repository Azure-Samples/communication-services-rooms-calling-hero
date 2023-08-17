import { IStackTokens, mergeStyles } from '@fluentui/react';

export const imgStyle = mergeStyles({
    width: '27.25rem',
    height: '20.125rem',
    selectors: {
        '@media (max-width: 67.1875rem)': {
            display: 'none'
        }
    }
});

export const containerTokens: IStackTokens = {
    childrenGap: '3.4375rem'
};

export const upperStackTokens: IStackTokens = {
    childrenGap: '2.625rem'
};

export const buttonStyle = mergeStyles({
    fontWeight: 600,
    fontSize: '0.875rem', // 14px
    height: '2.0rem',
    borderRadius: 3,
    padding: '0.625rem',
    margin: "0.3rem"
});

export const upperStackStyle = mergeStyles({
    selectors: {
        '@media (max-width: 53.4375rem)': {
            padding: '0.625rem'
        }
    }
});