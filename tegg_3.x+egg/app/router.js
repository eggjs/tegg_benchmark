module.exports = function (app) {
  const { controller } = app;
  app.get('/hello1', controller.eggController_1.hello);
  app.get('/hello10', controller.eggController_10.hello);
  app.get('/hello100', controller.eggController_100.hello);
  app.get('/hello1000', controller.eggController_1000.hello);
  app.get('/hello10000', controller.eggController_10000.hello);
};
