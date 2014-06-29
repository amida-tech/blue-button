## Tests

To execute the tests, install `mocha ` and run the following in the root of
the project:

    npm install -g mocha
    mocha test --recursive

It's important to run mocha with the `--recursive` flag, as most tests are
located in nested folders.


## Code coverage

To test code coverage of the tests, install `istanbul` and run it:

    npm install -g istanbul
    istanbul cover _mocha -- test --recursive

Note the underscore before mocha, and the `--` surrounded by spaces after _mocha.
See also https://github.com/gotwarlost/istanbul/issues/44.

To see the results, open the generated report in your browser:

    ./coverage/lcov-report/index.html



# ccda-generator
Exposes genWholeCCDA(), which takes in CCDA data in JSON format as a parameter and converts it
into CCDA/XML. 

Uses a JS XML DOM implementation (https://github.com/jindw/xmldom) to traverse the generated and expected XML documents and compare them by node (tagName) and by attribute and value. The default setting ignores comments and any whitespace, newlines, tab or text nodes. 

Important flags that can be altered if desired (in test-lib.js):
	PROMPT_TO_SKIP: If set to true, will prompt the user to either skip or not skip the failed test.
	DIFF (default): If set to true, will continue execution even upon failing a test and will output all of the errors/differences to the console. This is the default setting.

Other alterable settings under testXML.error_settings (in test-lib.js):
	"silence_cap": If set to true, will silence the output of capitalization errors. False by default.
	"silence_len": If set to true, will silence the output of attribute length errors (i.e. actual node has 2 attributes but expected node has 3 attributes). False by default.

Other settings:
TEST_CCDA_SAMPLES: uses ccda-explorer to test against sample_ccdas
TEST_CCD: tests against one generic sample ccda
TEST_SECTIONS: tests each section individually

Installation:

	npm install xmldom
	npm install execSync
	mocha test --recursive
