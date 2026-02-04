const RESEND_API_KEY = process.env.RESEND_API_KEY;
const PDF_URL = 'https://alexis91100.github.io/marie-antoinette-lp/assets/livre-blanc.pdf';

exports.handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    try {
        const { firstname, lastname, email, company, template } = JSON.parse(event.body);

        if (!email || !firstname) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Email et prénom requis' })
            };
        }

        let subject, htmlContent;

        if (template === 'livre-blanc') {
            // Email 1: Livre blanc
            subject = `${firstname}, votre livre blanc Marie Antoinette`;
            htmlContent = `
                <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 400; margin-bottom: 24px;">
                        Bonjour ${firstname},
                    </h1>
                    <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 20px;">
                        Merci pour votre intérêt ! Voici votre livre blanc <strong>"L'influence surpasse la pub"</strong> avec le cas pratique Dyson × Caroline Ambrosini.
                    </p>
                    <p style="margin: 30px 0;">
                        <a href="${PDF_URL}" style="display: inline-block; background: #000; color: #fff; padding: 16px 32px; text-decoration: none; font-size: 14px; letter-spacing: 0.5px;">
                            Télécharger le PDF
                        </a>
                    </p>
                    <p style="font-size: 14px; line-height: 1.6; color: #666;">
                        Bonne lecture !<br>
                        L'équipe Marie Antoinette
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0 20px;">
                    <p style="font-size: 12px; color: #999;">
                        Marie Antoinette — Agence média d'influence<br>
                        <a href="https://www.marie-antoinette.fr" style="color: #999;">www.marie-antoinette.fr</a>
                    </p>
                </div>
            `;
        } else {
            // Email 2: Suivi
            subject = `${firstname}, une question sur le livre blanc ?`;
            htmlContent = `
                <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 400; margin-bottom: 24px;">
                        ${firstname},
                    </h1>
                    <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 20px;">
                        Avez-vous eu le temps de parcourir notre livre blanc sur l'influence marketing ?
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 20px;">
                        Si vous avez des questions ou souhaitez discuter de votre stratégie d'influence, n'hésitez pas à nous contacter.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 20px;">
                        Nous serions ravis d'échanger avec vous sur les opportunités pour <strong>${company || 'votre entreprise'}</strong>.
                    </p>
                    <p style="margin: 30px 0;">
                        <a href="https://www.marie-antoinette.fr" style="display: inline-block; background: #000; color: #fff; padding: 16px 32px; text-decoration: none; font-size: 14px; letter-spacing: 0.5px;">
                            Découvrir l'agence
                        </a>
                    </p>
                    <p style="font-size: 14px; line-height: 1.6; color: #666;">
                        À très vite,<br>
                        L'équipe Marie Antoinette
                    </p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0 20px;">
                    <p style="font-size: 12px; color: #999;">
                        Marie Antoinette — Agence média d'influence<br>
                        <a href="https://www.marie-antoinette.fr" style="color: #999;">www.marie-antoinette.fr</a>
                    </p>
                </div>
            `;
        }

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Marie Antoinette <onboarding@resend.dev>',
                to: email,
                subject: subject,
                html: htmlContent
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Resend error:', data);
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ error: data.message || 'Erreur Resend' })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, id: data.id })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Erreur serveur' })
        };
    }
};
