'use strict';

describe('blue-button browser test', function () {

    var FileSupplyService;
    var ParserService;

    // load the application module
    beforeEach(module('bbTesting'));

    // get a reference to the service
    beforeEach(inject(function (_FileSupplyService_, _ParserService_) {
        FileSupplyService = _FileSupplyService_;
        ParserService = _ParserService_;
    }));

    describe('Service and Service Methods', function() {
        it('FileSupplyService', function () {
            expect(FileSupplyService).to.exist;
            expect(FileSupplyService.getFileContent).to.exist;
        });

        it('ParserService', function () {
            expect(ParserService).to.exist;
            expect(ParserService.parse).to.exist;
            expect(ParserService.validate).to.exist;
        });
    });

    describe('parser/validation', function() {
         it('CCDA', function() {
			var content = FileSupplyService.getFileContent();
            expect(content).to.exist;
            var json = ParserService.parse(content);
            expect(json).to.exists;
            var result = ParserService.validate(json);
            expect(result).to.be.true;
        });
    });
});
