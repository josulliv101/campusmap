

define(['../scripts/featureManager'], function (ModuleManager) {

  describe('ModuleManager Tests', function () {

    var manager;

    beforeEach(function(){

      manager = ModuleManager;

    });

    afterEach(function(){

      manager = undefined;

    });

    describe('ModuleManager Basic', function () {

      it('should have a getOverrides method', function () {

        expect(manager.getOverrides).toBeDefined();

      });

      it('should have a setPathsMap method', function () {

        expect(manager.setPathsMap).toBeDefined();

      });

      it('should parse a querystring', function () {

        var q = "?test=123&foo=bar", obj = manager.getOverrides(q);

        expect(obj).toBeDefined();

      });

      it('should not break if no querystring', function () {

        var q = "", obj = manager.getOverrides();

        expect(obj).toBeDefined();

        obj = manager.getOverrides("");

        expect(obj).toBeDefined();

      });

      it('should return an object of module key/vals', function () {

        var q = "?test=123&foo=bar&modules=module1|mymodule", obj = manager.getOverrides(q);

        expect(obj.module1).toBeDefined();

        expect(obj.module1).toBe('mymodule');

      });

      it('should handle multiple module key/vals', function () {

        var q = "?test=123&foo=bar&modules=module1|mymodule,module2|mymodule2", obj = manager.getOverrides(q);

        expect(obj.module1).toBe('mymodule');

        expect(obj.module2).toBe('mymodule2');

      });

      it('should handle bad syntax', function () {

        var q = "?test=123&foo=bar&modules=module1mymodule,module2|mymodule2", obj = manager.getOverrides(q);

        //expect(obj.module1).toBe('mymodule');

        expect(obj.module2).toBe('mymodule2');

      });

    });

    describe('Viewport size', function () {

      it('should have a method to test viewport sizes', function () {

        expect(ModuleManager.getViewportSize).toBeDefined();

      });


    });

  });

});