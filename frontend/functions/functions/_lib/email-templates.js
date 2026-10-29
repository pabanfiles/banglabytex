export function verifyEmailHtml(name, link) {
  return '<!DOCTYPE html><html><body style="margin:0;padding:0;background:#FAFAF9;font-family:-apple-system,Segoe UI,Roboto,sans-serif">' +
    '<div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06)">' +
    '<div style="background:#F97316;padding:28px 32px"><div style="color:#fff;font-size:22px;font-weight:700">PPM Creator</div><div style="color:#FFEDD5;font-size:13px;margin-top:4px">Verify your email to finish signing up</div></div>' +
    '<div style="padding:32px">' +
    '<p style="font-size:15px;color:#1c1917;margin:0 0 16px">Hi ' + (name || 'there') + ',</p>' +
    '<p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 20px">Welcome to PPM Creator. Tap the button below to verify your email address. This link expires in 24 hours.</p>' +
    '<a href="' + link + '" style="display:inline-block;padding:14px 28px;background:#F97316;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px">Verify email</a>' +
    '<p style="font-size:13px;color:#6b7280;margin:24px 0 0">If the button does not work, copy this link into your browser:</p>' +
    '<p style="font-size:12px;color:#6b7280;word-break:break-all;background:#FAFAF9;padding:10px;border-radius:8px;margin:6px 0 0">' + link + '</p>' +
    '<p style="font-size:13px;color:#9ca3af;margin:24px 0 0">If you did not create an account, ignore this email.</p>' +
    '</div></div></body></html>';
}
export function resetEmailHtml(name, link) {
  return '<!DOCTYPE html><html><body style="margin:0;padding:0;background:#FAFAF9;font-family:-apple-system,Segoe UI,Roboto,sans-serif">' +
    '<div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06)">' +
    '<div style="background:#F97316;padding:28px 32px"><div style="color:#fff;font-size:22px;font-weight:700">PPM Creator</div><div style="color:#FFEDD5;font-size:13px;margin-top:4px">Password reset</div></div>' +
    '<div style="padding:32px">' +
    '<p style="font-size:15px;color:#1c1917;margin:0 0 16px">Hi ' + (name || 'there') + ',</p>' +
    '<p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 20px">We received a request to reset your password. Tap the button below. This link expires in 30 minutes.</p>' +
    '<a href="' + link + '" style="display:inline-block;padding:14px 28px;background:#F97316;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px">Reset password</a>' +
    '<p style="font-size:13px;color:#6b7280;margin:24px 0 0">If the button does not work, copy this link into your browser:</p>' +
    '<p style="font-size:12px;color:#6b7280;word-break:break-all;background:#FAFAF9;padding:10px;border-radius:8px;margin:6px 0 0">' + link + '</p>' +
    '<p style="font-size:13px;color:#9ca3af;margin:24px 0 0">If you did not request this, you can ignore this email. Your password will not change.</p>' +
    '</div></div></body></html>';
}