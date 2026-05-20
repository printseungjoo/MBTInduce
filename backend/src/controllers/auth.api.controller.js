import { clearAuthSession } from "./auth.controller.js";
import { authenticateLocalUser, createLocalUser } from "../services/auth.service.js";
import { getProfilePayloadByUserId } from "../services/profile.service.js";
import { validateLoginBody, validateSignupBody } from "../validators/auth.validator.js";

function fail(res, status, message) {
  return res.status(status).json({ success: false, message });
}

function ok(res, status, data) {
  return res.status(status).json({ success: true, data });
}

function loginPromise(req, user) {
  return new Promise((resolve, reject) => {
    req.login(user, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export async function completeLocalSignup(req, res, signupValue) {
  const user = await createLocalUser(signupValue);
  await loginPromise(req, user);
  const data = await getProfilePayloadByUserId(user.id);
  return ok(res, 201, data);
}

export async function postSignup(req, res, next) {
  try {
    const parsed = validateSignupBody(req.body);
    if (!parsed.ok) {
      return fail(res, 400, parsed.message);
    }

    return await completeLocalSignup(req, res, parsed.value);
  } catch (err) {
    if (err.statusCode) {
      return fail(res, err.statusCode, err.message);
    }
    next(err);
  }
}

export async function postLogin(req, res, next) {
  try {
    const parsed = validateLoginBody(req.body);
    if (!parsed.ok) {
      return fail(res, 400, parsed.message);
    }

    const user = await authenticateLocalUser(parsed.value.email, parsed.value.password);
    await loginPromise(req, user);

    const data = await getProfilePayloadByUserId(user.id);
    return ok(res, 200, data);
  } catch (err) {
    if (err.statusCode) {
      return fail(res, err.statusCode, err.message);
    }
    next(err);
  }
}

export async function postApiLogout(req, res, next) {
  try {
    await clearAuthSession(req, res);
    return ok(res, 200, null);
  } catch (err) {
    next(err);
  }
}

export async function getAuthMe(req, res, next) {
  try {
    const data = await getProfilePayloadByUserId(req.user.id);
    if (!data) {
      return fail(res, 401, "Unauthorized");
    }
    return ok(res, 200, data);
  } catch (err) {
    next(err);
  }
}
