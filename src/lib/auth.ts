import { NextAuthOptions } from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import Discord from 'next-auth/providers/discord';
import db from '../../db';
export const authOptions: NextAuthOptions = {
	adapter: DrizzleAdapter(db),
	// Secret for Next-auth, without this JWT encryption/decryption won't work
	secret: process.env.NEXTAUTH_SECRET,

	// Configure one or more authentication providers
	providers: [
		Discord({
			clientId: process.env.DISCORD_ID as string,
			clientSecret: process.env.DISCORD_SECRET as string
		})
	],
	callbacks: {
		jwt({ token, account, user }) {
			if (account) {
				token.accessToken = account.access_token;
				token.id = user?.id;
			}
			return token;
		},
		async session({ session, user }) {
			// @ts-ignore
			session.user.id = user.id;
			return session;
		}
	}
};
