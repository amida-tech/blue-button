var fs = require("fs");

var senseString = require("../../index.js").senseString;

describe('sense.js test', function () {
  var ccda = "";
  var xml = "";
  var json = "";
  var large_json = "";
  var text = "";
  var broken_xml = "";
  var va = {};
  var ncpdp = "";

  beforeAll(function (done) {
    ccda = fs.readFileSync('./test/fixtures/sense/CCD.example.xml').toString();
    xml = fs.readFileSync('./test/fixtures/sense/empty.xml').toString();
    xml_no_declaration = fs.readFileSync('./test/fixtures/sense/empty_no_declaration.xml').toString();
    json = fs.readFileSync('./test/fixtures/sense/example.json').toString();
    large_json = fs.readFileSync('./test/fixtures/sense/large.json').toString();
    bb_json = fs.readFileSync('./test/fixtures/sense/blue-button.json').toString();
    text = fs.readFileSync('./test/fixtures/sense/example.txt').toString();
    format_x = fs.readFileSync('./test/fixtures/sense/format_x.txt').toString();
    cms = fs.readFileSync('./test/fixtures/sense/cms_sample.txt').toString();
    c32 = fs.readFileSync('./test/fixtures/sense/c32_sample.xml').toString();
    broken_xml = fs.readFileSync('./test/fixtures/sense/broken.xml').toString();
    pdf = fs.readFileSync('./test/fixtures/sense/VA_My_HealtheVet_Blue_Button_Sample_Version_12_6.pdf').toString();

    va["12"] = fs.readFileSync('./test/fixtures/sense/VA_My_HealtheVet_Blue_Button_Sample_Version_12.txt').toString();
    va["12_2"] = fs.readFileSync('./test/fixtures/sense/VA_My_HealtheVet_Blue_Button_Sample_Version_12_2.txt').toString();
    va["12_2_1"] = fs.readFileSync('./test/fixtures/sense/VA_My_HealtheVet_Blue_Button_Sample_Version_12_2_1.txt').toString();
    va["12_3"] = fs.readFileSync('./test/fixtures/sense/VA_My_HealtheVet_Blue_Button_Sample_Version_12_3.txt').toString();
    va["12_4"] = fs.readFileSync('./test/fixtures/sense/VA_My_HealtheVet_Blue_Button_Sample_Version_12_4.txt').toString();
    va["12_5"] = fs.readFileSync('./test/fixtures/sense/VA_My_HealtheVet_Blue_Button_Sample_Version_12_5.txt').toString();
    va["12_5_1"] = fs.readFileSync('./test/fixtures/sense/VA_My_HealtheVet_Blue_Button_Sample_Version_12_5_1.txt').toString();
    va["12_6"] = fs.readFileSync('./test/fixtures/sense/VA_My_HealtheVet_Blue_Button_Sample_Version_12_6.txt').toString();

    ncpdp = fs.readFileSync('./test/fixtures/sense/newrx.xml').toString();
    done();
  });

  it('should return NULL for no string with data passed', function () {
    expect(undefined).not.toEqual(senseString(undefined));
    expect(undefined).not.toEqual(senseString(null));
    expect(undefined).not.toEqual(senseString(2013));
  });

  it('should return CCDA for proper CCDA/XML input', function () {
    expect('ccda').toEqual(senseString(ccda).type);
  });

  it('should return XML for proper basic XML input', function () {
    expect('xml').toEqual(senseString(xml).type);
  });

  it('should return XML for XML input (no <?xml declaration)', function () {
    expect('xml').toEqual(senseString(xml_no_declaration).type);
  });

  it('should return C32 for proper VA C32 XML input', function () {
    expect('c32').toEqual(senseString(c32).type);
  });

  it('should return BLUE-BUTTON.JS for proper BB JSON input', function () {
    expect('blue-button.js').toEqual(senseString(bb_json).type);
  });

  it('should return JSON for proper JSON input', function () {
    expect('json').toEqual(senseString(json).type);
    expect('json').toEqual(senseString(large_json).type);
  });

  it('should return CMS and version for CMS BB text input', function () {
    expect('cms').toEqual(senseString(cms).type);
    expect(senseString(cms).version).toBeDefined();
    expect('2.0').toEqual(senseString(cms).version);
  });

  it('should return VA and version for VA BB text input', function () {
    for (var v in Object.keys(va)) {
      var key = Object.keys(va)[v];
      //console.log(key);
      var ver = key.split("_");
      if (ver.length === 1) {
        ver = ver[0];
      } else if (ver.length > 1) {
        ver = ver[0] + "." + ver[1];
      }
      //console.log(ver);
      //console.log(senseString(va[key]));
      expect('va').toEqual(senseString(va[key]).type);
      expect(senseString(va[key]).version).toBeDefined();
      expect(ver).toEqual(senseString(va[key]).version);
    }
  });

  it('should return PDF for PDF file input', function () {
    expect('pdf').toEqual(senseString(pdf).type);
  });

  try {
    require.resolve("blue-button-ncpdp");
    it('should return NCPDP for NCPDP file input', function () {
      expect('ncpdp').toEqual(senseString(ncpdp).type);
    });
  } catch (ex) { }

  it('should return FORMAT-X for format X text input', function () {
    expect('format-x').toEqual(senseString(format_x).type);
  });

  it('should return UNKNOWN for text input', function () {
    expect('unknown').toEqual(senseString(text).type);
  });

  it('should return UNKNOWN for broken XML input', function () {
    expect(['unknown', 'xml']).toEqual(expect.arrayContaining([senseString(broken_xml).type]));
  });

});
