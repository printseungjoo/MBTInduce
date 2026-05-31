import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../lib/prisma.js";
import { isAdminEmail, resolveRoleForEmail } from "../lib/adminEmails.js";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nickname: true,
        profileImage: true,
        role: true,
        status: true,
        onboardingCompleted: true
      },
    });

    done(null, user || false);
  } catch (error) {
    done(error);
  }
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:4000/auth/google/callback",
        passReqToCallback: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
      try {
        const mode = req.query.state === "login" ? "login" : "signup";
        const provider = "GOOGLE";
        const providerAccountId = profile.id;
        const email = profile.emails?.[0]?.value?.toLowerCase();
        const profileImage = profile.photos?.[0]?.value || null;
        const nickname = profile.displayName || email?.split("@")[0] || "user";

        if (!email) {
          return done(new Error("Google profile email is missing"));
        }

        let existingAccount = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider,
              providerAccountId,
          },
        },
        include: { user: true },
      });

      if (existingAccount?.user?.status === "DELETED") {
        await prisma.account.delete({
          where: {
            provider_providerAccountId: {
              provider,
              providerAccountId,
            },
          },
        });

        existingAccount = null;
      }

      if (existingAccount?.user) {
        if (existingAccount.user.status === "DELETED") {
          return done(new Error("Deleted account cannot login"));
        }

        if (existingAccount.user.status === "SUSPENDED") {
          return done(new Error("Suspended account cannot login"));
        }

        if (mode === "signup") {
          return done(new Error("Account already registered"));
        }

        const updateData = {
          lastLoginAt: new Date(),
          email,
          profileImage,
        };

        if (isAdminEmail(email) && existingAccount.user.role !== "ADMIN") {
          updateData.role = "ADMIN";
        }

        const updatedUser = await prisma.user.update({
          where: { id: existingAccount.user.id },
          data: updateData,
        });

        return done(null, updatedUser);
        }

        const existingUserByEmail = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUserByEmail && mode === "signup") {
          return done(new Error("Account already registered"));
        }

        if (!existingUserByEmail && mode === "login") {
          return done(new Error("Account not registered"));
        }

        let user = existingUserByEmail;

        if (user) {
          const updateData = { lastLoginAt: new Date() };
          if (isAdminEmail(email) && user.role !== "ADMIN") {
            updateData.role = "ADMIN";
          }
          user = await prisma.user.update({
            where: { id: user.id },
            data: updateData,
          });
        } else {
          user = await prisma.user.create({
            data: {
              email,
              nickname,
              profileImage,
              role: resolveRoleForEmail(email),
              status: "ACTIVE",
              lastLoginAt: new Date(),
            },
          });
        }

        await prisma.account.create({
          data: {
            userId: user.id,
            provider,
            providerAccountId,
            accessToken,
            refreshToken: refreshToken || null,
          },
        });

        await prisma.mbtiPreference.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
            energy: "E",
            information: "S",
            decision: "T",
            lifestyle: "J",
          },
        });

        const createdUser = await prisma.user.findUnique({ where: { id: user.id } });
        return done(null, createdUser);
      } catch (error) {
        return done(error);
      }
      }
    )
  );
}

export { passport };
