import { createClient } from '@supabase/supabase-js';

// Konfigurasi Supabase (ganti dengan milik Tuan)
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Generate random 5-6 karakter (hanya huruf kecil + angka)
    const generateCode = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    let code = generateCode();
    let exists = true;

    // Pastikan code unik
    while (exists) {
        const { data } = await supabase
            .from('shortlinks')
            .select('code')
            .eq('code', code)
            .single();
        
        if (!data) {
            exists = false;
        } else {
            code = generateCode();
        }
    }

    // Simpan ke database
    const { error } = await supabase
        .from('shortlinks')
        .insert([
            { code: code, original_url: url, created_at: new Date().toISOString() }
        ]);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ code: code });
      }
