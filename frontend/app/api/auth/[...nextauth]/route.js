// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


const handler = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

    secret: process.env.NEXTAUTH_SECRET || "aidfjnvociydfnovfadf",

 providers: [
   

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "text" },
        role: { type: "text" },
        _id: { type: "text" }
      },
      async authorize(credentials) {
        if (!credentials.email) return null;
        return {
          id: credentials._id,
          email: credentials.email,
          role: credentials.role,
          
        };
      }
    })
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Debugging: console.log what we're receiving
          console.log("Google signIn callback:", { user, account });
          
          // Get role from account scope or use default
          const role = account?.role || "customer";
          user.role = role;
          
          // Save user to your database via API
          const response = await fetch(`${process.env.NEXTAUTH_URL}/api/users/oauth`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              role: role,
              provider: "google",
              image: user.image
            }),
          });

          if (response.ok) {
            const userData = await response.json();
            user.id = userData._id;
           
          } else {
            console.error("Failed to save OAuth user");
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
        }
      }
      return true;
    },

    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      
      // Update token with Google data
      if (account?.provider === "google") {
        token.role = user?.role || "customer";
        if (profile) {
          token.name = profile.name;
          token.email = profile.email;
          token.picture = profile.picture;
        }
      }
      
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.email = token.email
      return session;
    },
  },

  pages: {
    signIn: '/signin',
    error: '/login?error='
  },

  debug: true, // Enable debugging
});

export { handler as GET, handler as POST };