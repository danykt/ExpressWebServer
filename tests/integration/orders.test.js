const request = require('supertest');
const {Adress} = require('../../models/adress');
const {User} = require('../../models/user');
const {Order} = require('../../models/order');
const mongoose = require('mongoose');
let server;

describe('/api/order/', () =>{
  beforeEach(() => {
    server = require('../../index');
  });

  afterEach(async () => {
    await server.close();
    await Adress.remove({});
    await User.remove({});
    await Order.remove({});
  });



  // describe('GET /', () =>{
  //   let token;
  //   let user;
  //   let adress;
  //
  //   beforeEach(async () => {
  //
  //     user = new User({name: 'Cesar Labastida', email: 'dany_baautista@hotmail.com', password: 'something'});
  //     await user.save();
  //
  //     token = new User({isAdmin: true}).generateAuthToken();
  //
  //     adress = new Adress({
  //       adress: 'Othello South ST ',
  //       state:'Washington',
  //       zipcode: '98118',
  //       city: 'Seattle',
  //     });
  //   });
  //
  //   it('should return all orders', async() =>{
  //
  //
  //     const orders = [
  //       {
  //         user: {
  //           name: user.name,
  //           phone: '206484444444',
  //           keyId: user._id
  //         },
  //         originAdress: {
  //           adress: 'Origin adress 1',
  //           state: adress.state,
  //           zipcode: adress.zipcode,
  //           city: adress.city
  //         },
  //         destinationAdress: {
  //           adress: 'Destination adress 1',
  //           state: adress.state,
  //           zipcode: adress.zipcode,
  //           city: adress.city
  //         }
  //       },
  //       {
  //         user: {
  //           name: user.name,
  //           phone: '206484444444',
  //           keyId: user._id
  //         },
  //         originAdress: {
  //           adress: 'Origin adress 2',
  //           state: adress.state,
  //           zipcode: adress.zipcode,
  //           city: adress.city
  //         },
  //         destinationAdress: {
  //           adress: 'Destination adress 2',
  //           state: adress.state,
  //           zipcode: adress.zipcode,
  //           city: adress.city
  //         }
  //       }
  //     ];
  //
  //     await Order.collection.insertMany(orders);
  //
  //     const res = await request(server).get('/api/orders').set('x-auth-token',token);
  //
  //     expect(res.status).toBe(200);
  //     expect(res.body.length).toBe(2);
  //     expect(res.body.some(g => g.user.name == 'Cesar Labastida')).toBeTruthy();
  //     expect(res.body.some(g => g.originAdress.adress == 'Origin adress 1')).toBeTruthy();
  //     expect(res.body.some(g => g.originAdress.adress == 'Origin adress 2')).toBeTruthy();
  //     expect(res.body.some(g => g.destinationAdress.adress == 'Destination adress 1')).toBeTruthy();
  //     expect(res.body.some(g => g.destinationAdress.adress == 'Destination adress 2')).toBeTruthy();
  //
  //
  //   });
  // });


  //something is wrong quering the test but endpoint works fine with postman
  describe('GET /specific/:id', () =>{
    let token;
    let user1;
    let user2;
    let adress;
    let order1;
    let order2;
    let order1Id;
    let order2Id;
    beforeEach(async () => {

      user1 = new User({name: 'Cesar Labastida', email: 'dany_baautista@hotmail.com', password: 'something'});
      user2 = new User({name: 'dany hernandez', email: 'labastidac@spu.edu', password: 'algo chido'});


      token = new User({isAdmin: true}).generateAuthToken();
       order1 = new Order({
        user: {
          name: user1.name,
          phone: '2222222222222',
          keyId: user1._id
        },
        originAdress: {
          adress: 'origin adress from Cesar Labastida',
          state: 'Oaxaca',
          zipcode: '98125',
          city: 'zongolica'
        },
        destinationAdress: {
          adress: 'destination adress from Cesar Labastida',
          state: 'monterrey',
          zipcode: '98125',
          city: 'fortin'
        }
      });

      await order1.save();

      order1Id = order1._id;


       order2 = new Order({
        user: {
          name: user2.name,
          phone: '3232323233232',
          keyId: user2._id
        },
        originAdress: {
          adress: 'origin adress dany hernadez',
          state: 'Oaxaca',
          zipcode: '98125',
          city: 'zongolica'
        },
        destinationAdress: {
          adress: 'destination adress from dany herandez',
          state: 'monterrey',
          zipcode: '98125',
          city: 'fortin'
        }
      });

      await order2.save();

      order2Id = order2._id;

    });


    it('should return an order if valid id is passed', async () => {




      const res1 = await request(server)
      .get('/api/orders/specific/' + order1._id)
      .set('x-auth-token',token);


      const res2 = await request(server)
      .get('/api/orders/specific/' + order2._id)
      .set('x-auth-token', token);



      expect(res1.status).toBe(200);
      expect(res1.body.length).toBe(1);
      expect(res1.body.some(g => g.user.name == 'Cesar Labastida')).toBeTruthy();
      expect(res1.body.some(g => g.originAdress.adress == 'origin adress from Cesar Labastida')).toBeTruthy();
      expect(res1.body.some(g => g.originAdress.state == 'oaxaca')).toBeTruthy();

      expect(res2.status).toBe(200);
      expect(res2.body.length).toBe(1);
      expect(res2.body.some(g => g.user.name == 'dany hernandez')).toBeTruthy();
      expect(res2.body.some(g => g.originAdress.adress == 'origin adress dany hernadez')).toBeTruthy();
      expect(res2.body.some(g => g.originAdress.state == 'monterrey')).toBeTruthy();


    });

  });

 // describe('POST/ ', () =>{
 //   let token;
 //   let user;
 //   let adress;
 //   let userId;
 //   let originAdressId
 //   let destinationAdressId
 //
 //   const exec = async() =>{
 //     return await request(server)
 //      .post('/api/orders/')
 //      .set('x-auth-token', token)
 //      .send({ userId, destinationAdressId, originAdressId });
 //   }
 //
 //
 //   beforeEach(async () => {
 //
 //     user = new User({name: 'Cesar Labastida', email: 'dany_baautista@hotmail.com', password: 'something'});
 //     await user.save();
 //
 //     token = user.generateAuthToken();
 //
 //     userId = user._id;
 //
 //     adress = new Adress({
 //       adress: 'Othello South ST ',
 //       state:'Washington',
 //       zipcode: '98118',
 //       city: 'Seattle',
 //       userId: user._id
 //     });
 //     await adress.save();
 //
 //     originAdressId = adress._id;
 //     destinationAdressId = adress._id;
 //   });
 //
 //   it('should return all orders', async() =>{
 //      const res = await exec();
 //
 //      expect(res.status).toBe(200);
 //   });
 //
 //
 //
 //
 // });

});
