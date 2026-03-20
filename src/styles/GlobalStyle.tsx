import { css, Global } from '@emotion/react'

export function GlobalStyle() {
    return (
        <Global styles={css`
            * {
                margin: 0;
                padding: 0;
                overflow-y: hidden;
            }

            html, body, #root {
                width: 100%;
                min-height: 100vh;
                margin: 0;
                padding: 0;
            }
            `}
        />
    )
}