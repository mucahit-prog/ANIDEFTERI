import React, { useState, useEffect } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { LinkContainer } from "react-router-bootstrap";
import { useLocation, useHistory } from "react-router-dom";

import { FcEditImage } from "react-icons/fc";
import { AiOutlineLogin } from "react-icons/ai";
import { RiLogoutCircleLine } from "react-icons/ri";

import { logout } from "../actions/userActions.js";

const Header = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [user, setUser] = useState();

  // çıkış yapmak için
  const exit = async (id) => {
    await dispatch(logout(id));
    setUser(null);
    history.push("/");
  };

  useEffect(() => {
    if (localStorage.getItem("user") && !user) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, [location, user]);

  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
        <LinkContainer to="/">
          <Navbar.Brand href="#home">Anı Defteri</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {user ? (
              <>
                <LinkContainer to="/create">
                  <Nav.Link>
                    <Button variant="outline-info">
                      <FcEditImage className="mr-2" size={20} />
                      Bir anı paylaş
                    </Button>
                  </Nav.Link>
                </LinkContainer>

                <Nav.Link>
                  <Button
                    onClick={(e) => {
                      exit(user.user._id);
                    }}
                    variant="outline-danger"
                  >
                    <RiLogoutCircleLine size={20} className="mr-2" />
                    Çıkış yap
                  </Button>
                </Nav.Link>
              </>
            ) : (
              <LinkContainer to="/auth">
                <Nav.Link>
                  <Button variant="outline-light">
                    <AiOutlineLogin size={20} className="mr-2" />
                    Giriş yap
                  </Button>
                </Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};
export default Header;
