import express from 'express';
import ctrl from './mock.controller';
const router = express.Router();

router.post('/auth', (req, res) => {
  const { email, password } = req.body;
  ctrl.isAuthenticated(email, password)
    .then(response => {
      if (!response.data) res.status(401).json({ message : 'Incorrect email or password'});
      const id = response.data;
      const access_token = ctrl.createToken({ email, id });
      res.status(200).json({ token: access_token });
    })
    .catch(err => {
      throw err;
    });
});

router.post('/users', (req, res) => {
  const { name, email, password } = req.body;
  const imageUrl = 'https://almsaeedstudio.com/themes/AdminLTE/dist/img/user2-160x160.jpg';
  ctrl.postUser(name, email, password, imageUrl)
    .then((response) => {
      if (!response.data) return res.status(401).json({ message: 'User already registered' });
      const id = response;
      const access_token = ctrl.createToken({ email, id });
      res.status(200).json({ message: 'User registered with success', token: access_token });
    })
    .catch(err => {
      throw err;
    });
});

router.get('/users', (req, res) => {
  const authorization = 'authorization';
  const token = req.body.token || req.query.token || req.headers[authorization];
  ctrl.getUser(token)
    .then(response => {
      if (!response.status) return res.status(401).json({ message: response.data });
      res.status(200).json({ message: 'Get user authorized', data: response.data });
    })
    .catch(err => {
      throw err;
    });
});

router.delete('/users', (req, res) => {
  const { key_admin } = req.body;
  if (key_admin === '123456') {
    ctrl.deleteUsers();
    res.status(200).json({ message: 'Users deleted with success' });
  } else {
    res.status(403).json({ message: 'Unauthorized rule' });
  }
});

export default router;
