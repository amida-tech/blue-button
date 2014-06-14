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

Uses a JS XML DOM implementation (https://github.com/jindw/xmldom) to traverse the generated and expected XML documents and compare them by node (tagName) and by attribute and value. The default setting ignores comments and any whitespace, newlines, tab or text nodes. 

There are a couple of settings that can be altered in the test-lib.js file:
	SKIP_COMMAND: If set to true, will prompt the user to either skip or not skip the failed test.
	DIFF_COMMAND: If set to true, will continue execution even upon failing a test and will output all of the errors/differences to the console.


Installation:

	npm install xmldom
	npm install execSync
	mocha test --recursive
