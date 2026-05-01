import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      setError("");
      await login(formData);
      navigate("/products");
    } catch (err) {
      setError("Virhe lomakkeen käsittelyssä: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3">
      <h2 className="mb-3">Kirjaudu sisään</h2>

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

      {error && <p className="text-danger">{error}</p>}

      <button 
        className="btn btn-primary" 
        type="submit" 
        disabled={loading}>
        {loading ? "Kirjaudutaan..." : "Kirjaudu"}
      </button>
      <button
        className="btn btn-link"
        type="button"
        onClick={() => navigate("/register")}
      >
        Rekisteröidy
      </button>
    </form>
  );
};

export default LoginForm;
