import { Link, NavLink } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import ThemeDropdown from "./ThemeDropdown";
import ClockDisplay from "./ClockDisplay";
import { useAuth } from "../../auth/useAuth";

const AppNavbar = () => {
  const { isAuthenticated, user, logout, hasRole } = useAuth();

  return (
    <Navbar expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to={isAuthenticated ? "/products" : "/login"}>
          <i
            className={`bi ${isAuthenticated ? "bi-unlock" : "bi-lock"} me-2`}
          ></i>
          Northwind
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />

        <Navbar.Collapse id="main-navbar-nav">
          {isAuthenticated && (
            <Nav className="me-auto">
              <NavDropdown title="Menu" id="main-menu-dropdown">
                <NavDropdown.Item as={NavLink} to="/employees">
                  Työntekijät
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/customers">
                  Asiakkaat
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/orders">
                  Tilaukset
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/categories">
                  Kategoriat
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/products">
                  Tuotteet
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/suppliers">
                  Toimittajat
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/regions">
                  Alueet
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/shippers">
                  Kuljettajat
                </NavDropdown.Item>

                {hasRole("Admin") && (
                  <NavDropdown.Item as={NavLink} to="/admin/users">
                    Käyttäjien hallinta
                  </NavDropdown.Item>
                )}
              </NavDropdown>
            </Nav>
          )}

          <div className="d-flex align-items-center">
            <ClockDisplay />
            
            <ThemeDropdown />

            <Nav className="ms-auto">
              {!isAuthenticated && (
                <Nav.Link as={NavLink} to="/login">
                  Kirjaudu sisään
                </Nav.Link>
              )}

              {isAuthenticated && (
                <NavDropdown
                  title={user?.userName || "Käyttäjä"}
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.ItemText>{user?.email}</NavDropdown.ItemText>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout}>Kirjaudu ulos</NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
