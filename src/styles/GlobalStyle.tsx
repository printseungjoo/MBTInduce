import { css, Global } from '@emotion/react'

export function GlobalStyle() {
    return(
        <Global styles = {css`
            * {
                margin: 0;
                padding: 0;
            }
            `}
        />
    )
}