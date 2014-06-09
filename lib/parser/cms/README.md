

## CMS Parser for Blue Button



##Design Decisions Documentation 

	#CMS to Intermediate Data Object
		1. Needed very specific matching patterns for metadata and claims summary, which turned out to be very unique. 
		2. For each section body, if a child has multiple keys with the exact same string, then the parser will start 
		assigning them numbers. 





##Task Backlog


1. Write tests
	1.a. Check what elements/sections are in CMS.
	1.b. Check what matches and what doesn't match.


2. Document intermediate model. Document which sections match and doesn't match. 


3. Work on parsing from the intermediate model to the actual bb model.
	Start with demographics.

4. Improve code flexibility
	4.a. abstract out matching from code.
		1. separate class for regular expressions.
		2. Detect the format of the text file(UTF-8, ascii), and make it be able to handle different text structures.


5. Putting proper codes for each medical term. May need to put uncoded tag. (
	Look at medical dictionaries/clinical vocabularies at bottom of CCDA pad)

6. Put a tag or some indicator to mark that the source is the CMS text file. 


##Integration Notes

First, add a line that says: 
In /lib/parser.js,

1. add
	require('(directory structure/CMSparser') or any other packages
2. In the last line of the file, you need to put the key value pair for the new CMSParser package




##CMS Parser Variable Terminology




Section is the entire chunk of data that includes the header and body.

Header is:

-------------------------------

Insert Section Name <--- header

-------------------------------


key: value 

key: value 

key: value   <------ This is one child 

key: value 

key: value 

key: value 

											<--- this entire piece is referred to as the body
key: value 

key: value 

key: value <------ This is another child

key: value 

key: value 




--------------------------------




