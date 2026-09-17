import styled from '@emotion/styled'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

type DesktopWidth = '30vw' | '40vw' | '50vw'

interface ModalProps {
    children: ReactNode;
    onClose?: () => void;
    desktopWidth?: DesktopWidth;
    label?: string;
}

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
`;

const Panel = styled.div<{ desktopWidth: DesktopWidth }>`
    width: min(90vw, 36rem);
    max-height: 85vh;
    overflow-y: auto;
    background-color: ${({ theme }) => theme.colors.lightWhite};
    border-radius: 1rem;
    padding: 2vh 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5vh;
    box-sizing: border-box;

    @media screen and (min-width: 768px) {
        width: ${({ desktopWidth }) => desktopWidth};
        padding: 2vh 1vw;
    }
`;

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
].join(', ');

export default function Modal({ children, onClose, desktopWidth = '30vw', label = 'Dialog' }: ModalProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {
        const previousFocus = document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        const panel = panelRef.current;
        if (!panel) {
            return;
        }

        const focusable = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        const first = focusable[0] ?? panel;
        first.focus();

        function onKeyDown(event: KeyboardEvent) {
            const dialog = panelRef.current;
            if (!dialog) {
                return;
            }
            if (event.key === 'Escape') {
                onCloseRef.current?.();
                return;
            }
            if (event.key !== 'Tab') {
                return;
            }
            const nodes = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
            if (nodes.length === 0) {
                event.preventDefault();
                dialog.focus();
                return;
            }
            const firstEl = nodes[0];
            const lastEl = nodes[nodes.length - 1];
            if (event.shiftKey && document.activeElement === firstEl) {
                event.preventDefault();
                lastEl.focus();
            } else if (!event.shiftKey && document.activeElement === lastEl) {
                event.preventDefault();
                firstEl.focus();
            }
        }

        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            previousFocus?.focus();
        };
    }, []);

    return createPortal(
        <Overlay>
            <Panel ref = { panelRef } role = 'dialog' aria-modal = 'true' aria-label = { label }
                tabIndex = { -1 } desktopWidth = { desktopWidth }>
                { children }
            </Panel>
        </Overlay>,
        document.body
    );
}
