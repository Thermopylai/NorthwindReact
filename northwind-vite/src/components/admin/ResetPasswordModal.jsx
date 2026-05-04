const ResetPasswordModal = ({
  user,
  password,
  loading,
  error,
  onPasswordChange,
  onClose,
  onConfirm,
}) => {
  if (!user) {
    return null;
  }

  const userName = user.userName ?? user.UserName;

  return (
    <>
      <div className="modal-backdrop fade show"></div>

      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Resetoi salasana</h5>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={loading}
                aria-label="Sulje"
              />
            </div>

            <div className="modal-body">
              <p>
                Olet resetoimassa käyttäjän{" "}
                <strong>{userName}</strong> salasanaa.
              </p>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <label htmlFor="newPassword" className="form-label">
                Uusi salasana
              </label>

              <input
                id="newPassword"
                name="newPassword"
                type="password"
                className="form-control"
                value={typeof password === "string" ? password : ""}
                onChange={(event) => onPasswordChange(event.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Peruuta
              </button>

              <button
                type="button"
                className="btn btn-warning"
                onClick={onConfirm}
                disabled={loading || !String(password ?? "").trim()}
              >
                {loading ? "Tallennetaan..." : "Resetoi salasana"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordModal;