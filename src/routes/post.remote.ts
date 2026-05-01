import {form} from "$app/server";
import * as v from 'valibot'
import {supabaseAdmin} from "$lib/utils/supabaseAdminClient";
import {
    MAX_CUSTOM_EDIT_CODE_LEN,
    MAX_CUSTOM_SLUG_LEN,
    MIN_CUSTOM_EDIT_CODE_LEN,
    schema,
    validateAlphanumNExtra
} from "$lib/shared.svelte";
import {invalid, redirect, error as sverror} from "@sveltejs/kit";
import {customAlphabet} from "nanoid";

const UPPER_AND_LOWER_CASE_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const generateToken = (len: number) => customAlphabet(UPPER_AND_LOWER_CASE_ALPHABET, len)()

// TODO now: validate schema on client
export const createPost = form(
    v.object({
        slug: v.pipe(v.string(), v.maxLength(MAX_CUSTOM_SLUG_LEN), validateAlphanumNExtra),
        // no one will guess ⋆✴︎˚｡⋆ as an edit code
        edit_code: v.pipe(
            v.string(),
            v.minLength(MIN_CUSTOM_EDIT_CODE_LEN),
            v.maxLength(MAX_CUSTOM_EDIT_CODE_LEN)),
        content: v.pipe(v.string(), v.nonEmpty(), v.transform(JSON.parse))
    }),
    async ({slug, edit_code, content}) => {
        console.log("aaaaaaaaaaaaaa post", slug)

        // slug
        const finalSlug = slug || generateToken(8);

        {
            const {data: exists, error} = await supabaseAdmin
                .from('posts')
                .select('slug')
                .eq('slug', finalSlug)
                .single()

            if (exists) return invalid('Slug already exists')
            if (error && error.code !== 'PGRST116') sverror(500, {message: 'Couldn\'t check slug'})
        }

        // custom slug
        const customSlug = Boolean(slug);

        // edit code
        const finalEditCode = edit_code || generateToken(10);

        // content
        let checker;
        try {
            checker = schema.nodeFromJSON(content);
        } catch {
            return invalid('Invalid text')
        }

        // it's loseless right?
        const cleanJSON = checker.toJSON();

        const {error} = await supabaseAdmin
            .from('posts')
            .insert({
                slug: finalSlug,
                custom_slug: customSlug,
                edit_code: finalEditCode,
                content: cleanJSON
            })

        if (error) {
            sverror(500, {message: 'Error saving post'})
        }

        redirect(303, `/${finalSlug}`);
    }
)