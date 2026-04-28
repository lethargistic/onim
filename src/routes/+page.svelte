<script lang="ts">
    import {absc, type Nullable} from "$lib/shared.svelte";
    import type EditorJS from "@editorjs/editorjs";
    import type {BlockToolConstructable} from "@editorjs/editorjs";
    import {onMount} from "svelte";
    import Header from '@editorjs/header';
    import EditorjsList from "@editorjs/list";
    import Delimiter from "@editorjs/delimiter";

    let editor: Nullable<EditorJS>;

    // TODO soon: configure, add more plugins, make it proper
    // TODO soon: i18n
    // TODO soon: data saving
    // TODO soon: data loading w data prop
    // TODO soon: link tool
    onMount(async () => {
        const EditorJS = (await import("@editorjs/editorjs")).default;

        editor = new EditorJS({
            holder: "editor-area",
            placeholder: "Write something...",
            autofocus: true,

            tools: {
                header: {
                    class: absc<BlockToolConstructable>(Header),
                },
                list: {
                    class: EditorjsList,
                    inlineToolbar: true,
                    config: {
                        defaultStyle: 'unordered'
                    }
                },
                delimiter: Delimiter
            }
        });
    })

    const handlePublish = (e: Event) => {
        if (e instanceof KeyboardEvent && e.key !== 'Enter') {
            return;
        }

        // TODO now: publish
    }

    let editorArea = $state<Nullable<HTMLDivElement>>(null);
    const handlePublishInputKeys = async (e: KeyboardEvent) => {
        if (e.key === "ArrowUp") {
            if (!editorArea) return;

            const range = document.createRange();
            const selection = window.getSelection();

            editorArea.focus();
            range.selectNodeContents(editorArea);
            range.collapse(false);
            if (!selection) return;
            selection.removeAllRanges();
            selection.addRange(range);

            e.preventDefault();
        }
    }
</script>

<div class="full-wrap">
    <div class="inner-wrap">
        <header>
            <div class="icon">
                vlvt
            </div>
            <div class="account">
                account
            </div>
        </header>
        <main>
            <section class="editor-seg">
                <!-- TODO: 間もなく make these random -->
                <div class="editor-wrap">
                    <div bind:this={editorArea} id="editor-area"></div>
                </div>
            </section>
            <section class="publish-seg">
                <button class="publish" aria-label="publish" onclick={handlePublish}>
                    Publish
                </button>
                <input onkeydown={handlePublishInputKeys}
                       autocomplete="off" type="text" maxlength="32" id="edit-code-input" placeholder="Custom edit code">
                <input onkeydown={handlePublishInputKeys}
                       autocomplete="off" type="text" maxlength="32" id="slug-input" placeholder="Custom url">

                <p>Your link: <span>ewewewe</span></p>
            </section>
        </main>
        <footer>
            © 2026 Lethargistic. I licked it, it's mine.
        </footer>
    </div>
</div>

<style>
    :global {
        .ce-block__content,
        .ce-toolbar__content {
            max-width: unset;
        }

        .ce-popover {
            --color-background: var(--background-color) !important;
            --color-text-primary: var(--text-color) !important;
        }

        .ce-toolbar__plus, .ce-toolbar__settings-btn {
            color: var(--text-color);
            border-radius: 4px;
        }

        .ce-toolbar__plus:hover, .ce-toolbar__settings-btn:hover {
            background-color: var(--accent-primary);
            color: var(--background-color);
        }

        .cdx_block:focus-visible {
            outline: none !important;
        }
    }

    .full-wrap {
        display: grid;
        place-items: center;

        & header {
            display: flex;

            & .account {
                margin-left: auto;
            }
        }

        & .inner-wrap {
            max-width: 1024px;
            width: 100%;
            padding: 3rem 0 4rem 0;

            & main {
                & .editor-seg {
                    height: 100vh;
                    padding: 2.5rem 0.15rem 0;
                    box-sizing: border-box;

                    & .editor-wrap {
                        all: unset;
                        resize: none;

                        width: 100%;
                        min-height: 100%;

                        font-size: 1.5rem;

                        white-space: pre-wrap;
                        overflow-wrap: break-word;
                    }
                }
            }
        }
    }
</style>