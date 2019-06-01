/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import users from '../model/authdata';

const { expect } = chai;
chai.use(chaiHttp);

const clearUsersData = (done) => {
  users.splice();
  done();
};

after((done) => {
  clearUsersData(done);
});

describe('App test the root app', () => {
  // test the root folder
  it('should GET the root route', async () => {
    await chai.request(app)
      .get('/')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.eql(200);
        expect(res.body.data).to.be.eql('Welcome to my API');
      });
  });

  it('it should return error when an unknown endpoint is hit', async () => {
    await chai.request(app)
      .get('/api/v1/unknown')
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res.body.status).to.be.eql(404);
        expect(res.body.error).to.be.eql('Page not found');
      });
  });
});

describe('User', () => {
  describe('POST/ create new user', () => {
    it('should create a user succesfully', async () => {
      const data = {
        email: 'example@automart234.com', first_name: 'Kenneth', last_name: 'Kenneth', password: '12345678', confirmPassword: '12345678',
      };
      await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(data)
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.eql(201);
          expect(res.body.data.id).exist;
          expect(res.body.data.token).exist;
          expect(res.body.data.first_name).to.be.eql(data.first_name);
          expect(res.body.data.last_name).to.be.eql(data.last_name);
          expect(res.body.data.email).to.be.eql(data.email);
        });
    });

    it('should return error if email already exist', async () => {
      const data = {
        email: 'example@automart234.com', first_name: 'Kenneth', last_name: 'Kenneth', password: '12345678', confirmPassword: '12345678',
      };
      await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(data)
        .then((res) => {
          expect(res).to.have.status(409);
          expect(res.body.status).to.be.eql(409);
          expect(res.body.error).to.be.eql('User with email already exist');
        });
    });

    it('should return error if email is invalid', async () => {
      const data = {
        email: 'examplcom', first_name: 'Kenneth', last_name: 'Kenneth', password: '12345678', confirmPassword: '12345678',
      };
      await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(data)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.eql(400);
          expect(res.body.error).to.be.eql('Incorrect email supplied');
        });
    });

    it('should return error if first_name is invalid', async () => {
      const data = {
        email: 'example@automart.com', last_name: 'Kenneth', password: '12345678', confirmPassword: '12345678',
      };
      await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(data)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.eql(400);
          expect(res.body.error).to.be.eql('First name must be between 5 to 100 digits');
        });
    });

    it('should return error if last_name is invalid', async () => {
      const data = {
        email: 'example@automart.com', first_name: 'Kenneth', password: '12345678', confirmPassword: '12345678',
      };
      await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(data)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.eql(400);
          expect(res.body.error).to.be.eql('Last name must be between 5 to 100 digits');
        });
    });

    it('should return error if password is invalid', async () => {
      const data = {
        email: 'example@automart.com', first_name: 'Kenneth', last_name: 'Kenneth', password: '12345', confirmPassword: '12345678',
      };
      await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(data)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.eql(400);
          expect(res.body.error).to.be.eql('Password must be longer than 7 characters');
        });
    });

    it('should return error if password is invalid', async () => {
      const data = {
        email: 'example@automart.com', first_name: 'Kenneth', last_name: 'Kenneth', password: '12345678', confirmPassword: '123456',
      };
      await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(data)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.eql(400);
          expect(res.body.error).to.be.eql('Password does not match');
        });
    });
  });

  describe('POST/ signin user', () => {
    it('should sign in a user successfully', async () => {
      const data = { email: 'example@automart234.com', password: '12345678' };

      await chai.request(app)
        .post('/api/v1/auth/signin')
        .send(data)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.data.token).exist;
          expect(res.body.data.id).exist;
          expect(res.body.data.email).to.be.eql(data.email);
        });
    });

    it('should return error if not registered user', async () => {
      const data = {
        email: 'example2@automart.com', password: '12345678',
      };
      await chai.request(app)
        .post('/api/v1/auth/signin')
        .send(data)
        .then((res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.eql(401);
          expect(res.body.error).to.be.eql('Username or password is incorrect');
        });
    });

    it('should return error if not registered user', async () => {
      const data = {
        email: 'example@automart234.com', password: '1234567',
      };
      await chai.request(app)
        .post('/api/v1/auth/signin')
        .send(data)
        .then((res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.eql(401);
          expect(res.body.error).to.be.eql('Username or password is incorrect');
        });
    });
    it('should return error if an unauthorized user tries to access the routes', async () => {
      await chai.request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${'bearerToken'}`)
        .send({
          state: 'new', price: 5000, manufacturer: 'Toyota', model: '2015', body_type: 'car',
        })
        .then((res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.eql(401);
          expect(res.body.error).to.be.eql('Authorization failed');
        });
    });
  });
});
