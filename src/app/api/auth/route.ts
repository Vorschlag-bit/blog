import { NextResponse } from "next/server";

export async function GET() {
    const CLIENT_ID = process.env.OAUTH_CLIENT_ID
    const redirect_uri = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,user`; 

    return NextResponse.redirect(redirect_uri)
}