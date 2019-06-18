/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = chai;
chai.use(chaiHttp);

let bearerToken;
describe('Cars', () => {
  it('should create a user succesfully', async () => {
    const data = {
      email: 'example@automart23456.com', first_name: 'Kenneth', last_name: 'Kenneth', password: '12345678', confirmPassword: '12345678',
    };
    await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(data)
      .then((res) => {
        expect(res).to.have.status(201);
        bearerToken = res.body.token;
      });
  });
  describe('POST/ place car AD if selected car does not exist', () => {
    it('should upload a car sales successfully', async () => {
      const data = {
        state: 'new', price: 5000, manufacturer: 'Toyota', model: '2015', body_type: 'car',
      };

      await chai.request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(data)
        .then((res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.eql(201);
          expect(res.body.data.id).exist;
          expect(res.body.data.state).to.be.eql(data.state);
          expect(res.body.data.price).to.be.eql(data.price);
          expect(res.body.data.manufacturer).to.be.eql(data.manufacturer);
          expect(res.body.data.model).to.be.eql(data.model);
          expect(res.body.data.body_type).to.be.eql(data.body_type);
        });
    });

    it('should return error if state is invalid', async () => {
      await chai.request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({
          state: 'invalid', price: 5000, manufacturer: 'Toyota', model: '2015', body_type: 'car',
        })
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.eql(400);
          expect(res.body.error).to.be.eql('State should be valid either new or used');
        });
    });

    it('should return error if price is invalid', async () => {
      await chai.request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({
          state: 'new', price: 'invalid', manufacturer: 'Toyota', model: '2015', body_type: 'car',
        })
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.eql(400);
          expect(res.body.error).to.be.eql('Invalid price supplied');
        });
    });

    it('should return error if manufacturer is invalid', async () => {
      await chai.request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({
          state: 'new', price: 5000, manufacturer: '', model: '2015', body_type: 'car',
        })
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.eql(400);
          expect(res.body.error).to.be.eql('manufacturer should be between 3 and 20 characters');
        });
    });

    it('should return error if model is invalid', async () => {
      await chai.request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({
          state: 'new', price: 5000, manufacturer: 'Toyota', model: '', body_type: 'car',
        })
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.eql(400);
          expect(res.body.error).to.be.eql('model should be between 3 and 20 characters');
        });
    });

    it('should return error if body type is invalid', async () => {
      await chai.request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({
          state: 'new', price: 5000, manufacturer: 'Toyota', model: '2015', body_type: '',
        })
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.eql(400);
          expect(res.body.error).to.be.eql('body type must be between 3 to 20 characters');
        });
    });
  });


  describe('PATCH/ update car status', () => {
    it('should update a car status successfully', async () => {
      let carId;
      await chai.request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({
          state: 'new', price: 5000, manufacturer: 'Toyota', model: '2015', body_type: 'car',
        })
        .then((res) => {
          expect(res).to.have.status(201);
          carId = res.body.data.id;
        });

      await chai.request(app)
        .patch(`/api/v1/car/${carId}/status`)
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({ status: 'sold' })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.data.id).to.be.eql(carId);
          expect(res.body.data.status).to.be.eql('sold');
        });
    });

    it('should return error if the updated car status is invalid', async () => {
      let carId;
      await chai.request(app)
        .post('/api/v1/car')
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({
          state: 'new', price: 5000, manufacturer: 'Toyota', model: '2015', body_type: 'car',
        })
        .then((res) => {
          expect(res).to.have.status(201);
          carId = res.body.data.id;
        });

      await chai.request(app)
        .patch(`/api/v1/car/${carId}/status`)
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({ status: 'invalid' })
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.eql(400);
          expect(res.body.error).to.be.eql('status should be valid either sold or available');
        });
    });

    it('should return error if car is invalid', async () => {
      await chai.request(app)
        .patch(`/api/v1/car/${19}/status`)
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({ status: 'sold' })
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.eql(404);
          expect(res.body.error).to.be.eql('Invalid car selected');
        });
    });

    it('should return error if car was not uploaded by user', async () => {
      await chai.request(app)
        .patch(`/api/v1/car/${15}/status`)
        .set('Authorization', `Bearer ${bearerToken}`)
        .send({ status: 'sold' })
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.eql(404);
          expect(res.body.error).to.be.eql('Invalid car selected');
        });
    });

    // it('should update a car price successfully', async () => {
    //   let carId;
    //   await chai.request(app)
    //     .post('/api/v1/car')
    //     .set('Authorization', `Bearer ${bearerToken}`)
    //     .send({
    //       state: 'new', price: 5000, manufacturer: 'Toyota', model: '2015', body_type: 'car',
    //     })
    //     .then((res) => {
    //       expect(res).to.have.status(201);
    //       carId = res.body.data.id;
    //     });

    //   await chai.request(app)
    //     .patch(`/api/v1/car/${carId}/price`)
    //     .set('Authorization', `Bearer ${bearerToken}`)
    //     .send({ price: 50000 })
    //     .then((res) => {
    //       expect(res).to.have.status(200);
    //       expect(res.body.data.id).to.be.eql(carId);
    //       expect(res.body.data.price).to.be.eql(50000);
    //     });
    // });

    // it('should return error if the updated car price is invalid', async () => {
    //   let carId;
    //   await chai.request(app)
    //     .post('/api/v1/car')
    //     .set('Authorization', `Bearer ${bearerToken}`)
    //     .send({
    //       state: 'new', price: 5000, manufacturer: 'Toyota', model: '2015', body_type: 'car',
    //     })
    //     .then((res) => {
    //       expect(res).to.have.status(201);
    //       carId = res.body.data.id;
    //     });

    //   await chai.request(app)
    //     .patch(`/api/v1/car/${carId}/price`)
    //     .set('Authorization', `Bearer ${bearerToken}`)
    //     .send({ price: 'invalid' })
    //     .then((res) => {
    //       expect(res).to.have.status(400);
    //       expect(res.body.status).to.be.eql(400);
    //       expect(res.body.error).to.be.eql('Invalid price supplied');
    //     });
    // });

    // it('should return error if car is invalid', async () => {
    //   await chai.request(app)
    //     .patch(`/api/v1/car/${19}/price`)
    //     .set('Authorization', `Bearer ${bearerToken}`)
    //     .send({ price: 50000 })
    //     .then((res) => {
    //       expect(res).to.have.status(404);
    //       expect(res.body.status).to.be.eql(404);
    //       expect(res.body.error).to.be.eql('Invalid car selected');
    //     });
    // });

    // it('should return error if car was not uploaded by user', async () => {
    //   await chai.request(app)
    //     .patch(`/api/v1/car/${1}/price`)
    //     .set('Authorization', `Bearer ${bearerToken}`)
    //     .send({ price: 50000 })
    //     .then((res) => {
    //       expect(res).to.have.status(404);
    //       expect(res.body.status).to.be.eql(404);
    //       expect(res.body.error).to.be.eql('Invalid car selected');
    //     });
    // });
  });

  //   describe('GET/ placed car orders', () => {
  //     it('should view all cars successfully', async () => {
  //       await chai.request(app)
  //         .get('/api/v1/car')
  //         .set('Authorization', `Bearer ${bearerToken}`)
  //         .then((res) => {
  //           expect(res).to.have.status(200);
  //           expect(res.body.status).to.be.eql(200);
  //           expect(res.body.data).to.be.an('Array');
  //         });
  //     });

  //     it('should view a particular car sales', async () => {
  //       let carId;
  //       const data = {
  //         state: 'new', price: 5000, manufacturer: 'Toyota', model: '2015', body_type: 'car',
  //       };

  //       await chai.request(app)
  //         .post('/api/v1/car')
  //         .set('Authorization', `Bearer ${bearerToken}`)
  //         .send(data)
  //         .then((res) => {
  //           expect(res).to.have.status(201);
  //           carId = res.body.data.id;
  //         });

  //       await chai.request(app)
  //         .get(`/api/v1/car/${carId}`)
  //         .set('Authorization', `Bearer ${bearerToken}`)
  //         .then((res) => {
  //           expect(res).to.have.status(200);
  //           expect(res.body.status).to.be.eql(200);
  //           expect(res.body.data.id).exist;
  //           expect(res.body.data.state).to.be.eql(data.state);
  //           expect(res.body.data.price).to.be.eql(data.price);
  //           expect(res.body.data.manufacturer).to.be.eql(data.manufacturer);
  //           expect(res.body.data.model).to.be.eql(data.model);
  //           expect(res.body.data.body_type).to.be.eql(data.body_type);
  //         });
  //     });

  //     it('should return error if an invalid car is selected', async () => {
  //       await chai.request(app)
  //         .get(`/api/v1/car/${67}`)
  //         .set('Authorization', `Bearer ${bearerToken}`)
  //         .then((res) => {
  //           expect(res).to.have.status(404);
  //           expect(res.body.status).to.be.eql(404);
  //           expect(res.body.error).to.be.eql('Car not found');
  //         });
  //     });

  //     it('should view all cars with status available', async () => {
  //       await chai.request(app)
  //         .get('/api/v1/car?status=available')
  //         .set('Authorization', `Bearer ${bearerToken}`)
  //         .then((res) => {
  //           expect(res).to.have.status(200);
  //           expect(res.body.status).to.be.eql(200);
  //           expect(res.body.data).to.be.an('Array');
  //         });
  //     });

  //     it('should view all cars with status available and within a price range', async () => {
  //       await chai.request(app)
  //         .get('/api/v1/car?status=available&min_price=1000&max_price=50000')
  //         .set('Authorization', `Bearer ${bearerToken}`)
  //         .then((res) => {
  //           expect(res).to.have.status(200);
  //           expect(res.body.status).to.be.eql(200);
  //           expect(res.body.data).to.be.an('Array');
  //         });
  //     });

  //     it('should view all cars with status available and within a price range', async () => {
  //       await chai.request(app)
  //         .get('/api/v1/car?status=available&min_price=1000000&max_price=50000000')
  //         .set('Authorization', `Bearer ${bearerToken}`)
  //         .then((res) => {
  //           expect(res).to.have.status(404);
  //           expect(res.body.status).to.be.eql(404);
  //           expect(res.body.error).to.be.eql('Car not found');
  //         });
  //     });
  //   });

  //   describe('DELETE/ remove posted car add', async () => {
  //     it('should view a particular car sales', async () => {
  //       let carId;
  //       const data = {
  //         state: 'new', price: 5000, manufacturer: 'Toyota', model: '2015', body_type: 'car',
  //       };

  //       await chai.request(app)
  //         .post('/api/v1/car')
  //         .set('Authorization', `Bearer ${bearerToken}`)
  //         .send(data)
  //         .then((res) => {
  //           expect(res).to.have.status(201);
  //           carId = res.body.data.id;
  //         });

  //       await chai.request(app)
  //         .delete(`/api/v1/car/${carId}`)
  //         .set('Authorization', `Bearer ${bearerToken}`)
  //         .then((res) => {
  //           expect(res).to.have.status(200);
  //           expect(res.body.status).to.be.eql(200);
  //           expect(res.body.data).to.be.eql('Car Ad successfully deleted');
  //         });
  //     });

  //     it('should return error if an unauthorized user tries to delete an AD', async () => {
  //       let bearerToken1;
  //       const data = {
  //         email: 'example@automart234567.com', first_name: 'Kenneth'
  //  last_name: 'Kenneth', password: '12345678', confirmPassword: '12345678',
  //       };
  //       await chai.request(app)
  //         .post('/api/v1/auth/signup')
  //         .send(data)
  //         .then((res) => {
  //           expect(res).to.have.status(201);
  //           bearerToken1 = res.body.data.token;
  //         });

  //       let carId;
  //       const data1 = {
  //         state: 'new', price: 5000, manufacturer: 'Toyota', model: '2015', body_type: 'car',
  //       };

  //       await chai.request(app)
  //         .post('/api/v1/car')
  //         .set('Authorization', `Bearer ${bearerToken1}`)
  //         .send(data1)
  //         .then((res) => {
  //           expect(res).to.have.status(201);
  //           carId = res.body.data.id;
  //         });

//       await chai.request(app)
//         .delete(`/api/v1/car/${carId}`)
//         .set('Authorization', `Bearer ${bearerToken1}`)
//         .then((res) => {
//           expect(res).to.have.status(401);
//           expect(res.body.status).to.be.eql(401);
//           expect(res.body.error).to.be.eql('Not permited to complete this action');
//         });
//     });
//   });
});
