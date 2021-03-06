import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Message from "../components/Message";

import { useDispatch, useSelector } from "react-redux";
import { signup } from "../actions/userActions.js";

const AuthView = ({ history }) => {
  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const userState = useSelector((state) => state.user);
  const { error } = userState;

  const [form, setForm] = useState(initialFormData);
  const [login, setLogin] = useState(true);

  const dispatch = useDispatch();
  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            {/* login ekranı */}
            {login ? (
              <Form className="align-content-center mt-3">
                <h1 className="text-center mb-3">Giriş yap</h1>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email adresinizi girin"
                  ></Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Şifre</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Şifrenizi girin"
                  ></Form.Control>
                </Form.Group>

                <div className="d-grid mt-3">
                  <Button type="submit">Giriş Yap</Button>
                </div>

                <Form.Text className="text-center mt-2">
                  Henüz bir hesabınız yok mu?{" "}
                  <span
                    onClick={(e) => setLogin(!login)}
                    style={{ fontWeight: "bold", cursor: "pointer" }}
                  >
                    Hesap oluştur
                  </span>
                </Form.Text>
              </Form>
            ) : (
              // kayıt ekranı (register)
              <Form
                onSubmit={(e) => {
                  e.preventDefault();

                  if (!login) {
                    dispatch(signup(form, history));
                  }
                }}
                className="align-content-center mt-3"
              >
                <h1 className="text-center mb-3">Kayıt ol</h1>
                {error && <Message>{error}</Message>}

                <Form.Group style={{ display: "flex" }}>
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    className="mr-2"
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                  ></Form.Control>

                  <Form.Control
                    type="text"
                    placeholder="Last Name"
                    className="ml-2"
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                  ></Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email adresinizi girin"
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  ></Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Şifre</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Şifrenizi girin"
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  ></Form.Control>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Şifrenizi doğrulayın</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Şifrenizi doğrulayın"
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                  ></Form.Control>
                </Form.Group>

                <div className="d-grid mt-3">
                  <Button type="submit">Kayıt Ol</Button>
                </div>

                <Form.Text className="text-center mt-2">
                  Zaten bir hesabınız var mı?{" "}
                  <span
                    onClick={(e) => setLogin(!false)}
                    style={{ fontWeight: "bold", cursor: "pointer" }}
                  >
                    Giriş yapın
                  </span>
                </Form.Text>
              </Form>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AuthView;
