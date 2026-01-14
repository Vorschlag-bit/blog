import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) return NextResponse.json({ error: 'No code' }, { status: 400 });

    try {
        const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                client_id: process.env.OAUTH_CLIENT_ID,
                client_secret: process.env.OAUTH_CLIENT_SECRET,
                code
            })
        })

        const result = await response.json();

        if (result.error) throw Error('Github reponse result is error');

        const token = result.access_token

        const message = JSON.stringify({ token }); 
        
        const origin = request.headers.get('referer') || '*';

        const script = `
        <script>
            const receiveMsg = (msg) => {
                window.opener.postMessage(
                    'authorization:github:success:${message}',
                    '${origin}'
                );
                window.removeEventListener('message', receiveMsg, false);
            }
            window.addEventListener('message', receiveMsg, false);
            window.opener.postMessage('authorizing:github', '*');
        </script>
    `

        return new NextResponse(script, {
            headers: { 'Content-Type': 'text/html' }
        })
    } catch (err) {
        console.error('Github Oauth error: ', err);
        return NextResponse.json({ error: `Github Oauth error - ${err}` }, { status: 400 })
    }
}