
define([

  '../scripts/app'

], function (App) {

  describe('App Tests', function () {

    var app, el = document.getElementsByTagName('body')[0];

    beforeEach(function() {

      spyOn(App.prototype, 'init').andCallThrough();

      spyOn(App.prototype, 'start');

      spyOn(App.prototype, 'fetch').andReturn({ campus: 'medford' });

      app = new App(el, { fakeSettings: true }, { fakeConfigSettings: true });

      app.controller = new FakeController();

    });

    afterEach(function(){

        app = null;

    });

    describe('DOM', function () {

      it('should not throw an error when a root dom element is passed in', function () {

        expect( function() { 

          var a2 = new App(el, {});  

        }).not.toThrow();

      });

    });

    describe('Error Handling', function () {

      it('should throw an error if no root dom element', function () {

        expect( function() { 

          var a1 = new App();  

        }).toThrow();

      });

    });

    describe('Functions', function () {

      it('should call start() after init() is called', function () {

        app.init();

        expect( App.prototype.start ).toHaveBeenCalled();

      });

      it('should override settings with the controller getData() return', function () {

        app.init();

        expect( App.prototype.start ).toHaveBeenCalledWith({ campus: 'medford' });

      });

    });

  });

});



