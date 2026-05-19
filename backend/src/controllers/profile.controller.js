import { getProfilePayloadByUserId, updateProfile } from "../services/profile.service.js";
import { validateProfilePatchBody } from "../validators/profile.validator.js";

function fail(res, status, message) {
  return res.status(status).json({ success: false, message });
}

function ok(res, status, data) {
  return res.status(status).json({ success: true, data });
}

export async function getProfile(req, res, next) {
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

export async function patchProfile(req, res, next) {
  try {
    const parsed = validateProfilePatchBody(req.body);
    if (!parsed.ok) {
      return fail(res, 400, parsed.message);
    }

    const { nickname, mbti } = parsed.value;
    const data = await updateProfile(req.user.id, { nickname, mbti });
    return ok(res, 200, data);
  } catch (err) {
    next(err);
  }
}
