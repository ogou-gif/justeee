import 'dotenv/config';
import http from 'http';
import { URLSearchParams } from 'url';
import fetch from 'node-fetch';

const apiKey = process.env.SENDGRID_API_KEY;

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/send') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString(); // Convertir les chunks en chaîne
        });

        req.on('end', () => {
            const params = new URLSearchParams(body);
            const name = params.get('name')?.trim();
            const email = params.get('email')?.trim();
            const phone = params.get('phone')?.trim(); // Optionnel
            const message = params.get('message')?.trim();

            // Log des données reçues
            console.log('Données reçues :', { name, email, phone, message });

            // Vérifie que les champs obligatoires sont présents
            if (!name || !email || !message) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                return res.end('Nom, email et message sont obligatoires.');
            }

            // Données pour l'envoi d'e-mail
            const emailData = {
                personalizations: [{ to: [{ email: 'ogoujuste60@gmail.com' }] }],
                from: { email: 'no-reply@votre-domaine.com' }, // Assurez-vous que ce domaine est autorisé dans SendGrid
                subject: `Message de ${name}`,
                content: [{ type: 'text/plain', value: `Nom: ${name}\nEmail: ${email}\nTéléphone: ${phone}\nMessage:\n${message}` }]
            };

            // Options pour la requête fetch
            fetch('https://api.sendgrid.com/v3/mail/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData)
            })
                .then(response => {
                    if (response.ok) {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end('Le message a été envoyé avec succès.');
                    } else {
                        console.error('Erreur lors de l\'envoi d\'e-mail :', response.status, response.statusText);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Une erreur est survenue lors de l\'envoi du message.');
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de l\'envoi d\'e-mail :', error);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Une erreur est survenue lors de l\'envoi du message.');
                });
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Méthode non autorisée.');
    }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Le serveur écoute sur le port ${PORT}`);
});
