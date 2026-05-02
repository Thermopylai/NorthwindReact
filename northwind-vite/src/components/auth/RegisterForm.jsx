import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      if (formData.password !== formData.confirmPassword) {
        setError("Salasanat eivät täsmää");
        setSubmitting(false);
        return;
      }
      await register(formData);
      navigate("/products");
    } catch (err) {
      setError("Virhe lomakkeen käsittelyssä: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3">
      <h2 className="mb-3">Rekisteröidy</h2>

      <div className="mb-3">
        <label className="form-label" htmlFor="userName">
          Käyttäjänimi
        </label>
        <input
          id="userName"
          name="userName"
          className="form-control"
          value={formData.userName}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="email">
          Sähköposti
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="form-control"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="password">
          Salasana
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="form-control"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="confirmPassword">
          Vahvista salasana
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="form-control"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>

      {error && <p className="text-danger">{error}</p>}

      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Rekisteröidytään..." : "Rekisteröidy"}
      </button>
    </form>
  );
};

export default RegisterForm;
