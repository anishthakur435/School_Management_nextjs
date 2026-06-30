import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const user = {
          id: credentials.id,
          name: credentials.name,
          email: credentials.email,
          role: credentials.role,
          contact: credentials.contact,
          password: credentials.password,
          email: credentials.email,
          password: credentials.password,
        };
        if (!user.email || !user.password) {
          throw new Error("Email and password are required");
        }
        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.accessToken = token.accessToken;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
      }

      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },
};
