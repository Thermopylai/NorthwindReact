const ResetPasswordModal = ({
  user,
  password,
  loading,
  onPasswordChange,
  onClose,
  onConfirm,
}) => {
  console.log(
    "ResetPasswordModal renderöityy, user:",
    user,
    "password:",
    password,
    "loading:",
    loading,
  );

  return (
    <>
      {user && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Resetoi salasana</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  disabled={loading}
                />
              </div>

              <div className="modal-body">
                <p>
                  Olet resetoimassa käyttäjän{" "}
                  <strong>{user.userName ?? user.UserName}</strong> salasanaa.
                </p>

                <label className="form-label">Uusi salasana</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
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
                  disabled={loading}
                >
                  {loading ? "Tallennetaan..." : "Resetoi salasana"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetPasswordModal;
