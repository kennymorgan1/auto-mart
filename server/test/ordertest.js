/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;
chai.use(chaiHttp);

let bearerToken;
describe('Orders', () => {
  it('should create a user succesfully', async () => {
    const data = {
      email: 'example@automart2345.com', first_name: 'Kenneth', last_name: 'Kenneth', password: '12345678', confirmPassword: '12345678',
    };
    await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(data)
      .then((res) => {
        expect(res).to.have.status(201);
        bearerToken = res.body.data.token;
      });
  });
  describe('POST/ place order if selected car does not exist', () => {
    it('should return error if an invalid car is selected', async () => {
      const data = { car_id: 56, price: 5000, status: 'pending' };
      await chai.request(app)
        .post('/api/v1/order')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(data)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.eql(404);
          expect(res.body.error).to.be.eql('Invalid car selected');
        });
    });

    it('should place an order successfully', async () => {
      let car;
      await chai.request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({
          state: 'new', price: 5000, manufacturer: 'Toyota', model: '2015', body_type: 'car',
        })
        .then((res) => {
          expect(res).to.have.status(201);
          car = res.body.data.id;
        });

      const data = { car_id: car, price: 5000, status: 'pending' };
      await chai.request(app)
        .post('/api/v1/order')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(data)
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.eql(201);
          expect(res.body.data).exist;
          expect(res.body.data.id).exist;
          expect(res.body.data.price_offered).to.be.eql(data.price);
          expect(res.body.data.status).to.be.eql(data.status);
        });
    });

    it('should return error if invalid id is supplied', async () => {
      const data = { car_id: 'tfdt', price: 5000, status: 'pending' };
      await chai.request(app)
        .post('/api/v1/order')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(data)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.eql(400);
          expect(res.body.error).to.be.eql('Invalid car supplied');
        });
    });

    it('should return error if invalid id is supplied', async () => {
      const data = { car_id: 1, price: 'money', status: 'pending' };
      await chai.request(app)
        .post('/api/v1/order')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(data)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.eql(400);
          expect(res.body.error).to.be.eql('Invalid price supplied');
        });
    });

    it('should return error if invalid status is supplied', async () => {
      const data = { car_id: 1, price: 5000, status: 'invalid' };
      await chai.request(app)
        .post('/api/v1/order')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(data)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.eql(400);
          expect(res.body.error).to.be.eql('status should be valid either pending, accepted or rejected');
        });
    });
  });

  describe('PATCH/ update order price', () => {
    it('should update an order successfully', async () => {
      let orderId;
      let car;
      await chai.request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({
          state: 'new', price: 5000, manufacturer: 'Toyota', model: '2015', body_type: 'car',
        })
        .then((res) => {
          expect(res).to.have.status(201);
          car = res.body.data.id;
        });

      const data = { car_id: car, price: 5000, status: 'pending' };
      await chai.request(app)
        .post('/api/v1/order')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(data)
        .then((res) => {
          expect(res).to.have.status(201);
          orderId = res.body.data.id;
        });

      await chai.request(app)
        .patch(`/api/v1/order/${orderId}/price`)
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({ price: 7000 })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.data.id).to.be.eql(orderId);
          expect(res.body.data.new_price_offered).to.be.eql(7000);
        });
    });

    it('should return error if the updated order price is invalid', async () => {
      let orderId;
      let car;
      await chai.request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({
          state: 'new', price: 5000, manufacturer: 'Toyota', model: '2015', body_type: 'car',
        })
        .then((res) => {
          expect(res).to.have.status(201);
          car = res.body.data.id;
        });

      const data = { car_id: car, price: 5000, status: 'pending' };
      await chai.request(app)
        .post('/api/v1/order')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(data)
        .then((res) => {
          expect(res).to.have.status(201);
          orderId = res.body.data.id;
        });

      await chai.request(app)
        .patch(`/api/v1/order/${orderId}/price`)
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({ price: 'invalid' })
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.eql(400);
          expect(res.body.error).to.be.eql('Invalid price supplied');
        });
    });

    it('should return error if order is invalid', async () => {
      await chai.request(app)
        .patch(`/api/v1/order/${19}/price`)
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({ price: 5000 })
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.eql(404);
          expect(res.body.error).to.be.eql('Invalid order selected');
        });
    });

    it('should return error if order was not placed by user', async () => {
      await chai.request(app)
        .patch(`/api/v1/order/${15}/price`)
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({ price: 5000 })
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.eql(404);
          expect(res.body.error).to.be.eql('Invalid order selected');
        });
    });
  });
});
