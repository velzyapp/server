const passport = require('koa-passport')
const GoogleStrategy = require('passport-google-auth').Strategy
const GithubStrategy = require('passport-github').Strategy

//possibly want to go with Easy Auth...

passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
  try {
    const user={};
    done(null, user)
  } catch(err) {
    done(err)
  }
})

passport.use(new GoogleStrategy({
    clientId: 'your-google-oauth-client-id',
    clientSecret: 'your-google-oauth-client-secret',
    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/users/auth/google/callback'
  },
  async (token, tokenSecret, profile, done) => {
    // Retrieve user from database, if exists
    const user = await User.findOne(profile.emails[0].value)
    if (user) {
      done(null, user)
    } else {
      // If user not exist, create it
      const newUser = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        password: 'password-is-from-google',
        email: profile.emails[0].value
      }
      const createdUser = await User.create(newUser)
      if (createdUser) {
        done(null, createdUser)
      } else {
        done(null, false)
      }
    }
  }
));

passport.use(new GithubStrategy({
    clientID: '',
    clientSecret: '',
    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/github/callback',
    profileFields: ['id', 'displayName', 'name', 'photos', 'email']
  },
  async (token, tokenSecret, profile, done) => {
     // Retrieve user from database, if exists
    const user = {}
    if (user) {
      done(null, user)
    } else {
      // If user not exist, create it
      const newUser = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        password: 'password-is-from-google',
        email: profile.emails[0].value
      }
      const createdUser = await User.create(newUser)
      if (createdUser) {
        done(null, createdUser)
      } else {
        done(null, false)
      }
    }
  }
));
