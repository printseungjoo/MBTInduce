import { css, Global } from '@emotion/react'
import { theme } from './theme'

export function GlobalStyle() {
    return (
        <Global styles = {css`
            * {
                margin: 0;
                padding: 0;
            }

            html, body, #root {
                width: 100%;
                min-height: 100vh;
                margin: 0;
                padding: 0;
                background-color: ${theme.colors.midnightPurple};
                font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
            }

            button {
                cursor: pointer;
                font-family: inherit;
            }
            `}
        />
    )
}