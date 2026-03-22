import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    const { code } = req.query;
    
    // Ambil parameter path (format: linkxxx)
    let shortCode = code;
    if (code.startsWith('link')) {
        shortCode = code.substring(4); // hapus "link"
    }

    const { data, error } = await supabase
        .from('shortlinks')
        .select('original_url')
        .eq('code', shortCode)
        .single();

    if (error || !data) {
        return res.status(404).send(`
            <!DOCTYPE html>
            <html>
            <head><title>404 - Link Not Found</title></head>
            <body style="background:#0a0a0a; color:#00ffcc; display:flex; justify-content:center; align-items:center; height:100vh; font-family:monospace;">
                <h1>❌ Link tidak ditemukan atau sudah kadaluarsa.</h1>
            </body>
            </html>
        `);
    }

    // Redirect ke URL asli
    res.writeHead(302, { Location: data.original_url });
    res.end();
}
