

# CMS Parser for Blue Button



##Design Decisions Documentation 


**Object Transformation:**
CMS text file --> Intermediate JavaScript Object --> BlueButton Object 

**Data direction**

cmsToIntermediateObj(currently cmsParser) --> intermediatetoObjConverter


**cmsTOIntermediateObj**

1. Minimum number of dashes to separate section is four dashes.
2. Minimum number of newline characters to qualify as a space is 2-3 new lines, depending on where it is in the file.
It is usually three unless the child is at the end of the file.
3. Needed very specific matching patterns for metadata and claims summary, which turned out to be very unique. 
Other sections are parsed with a generic parsing function.
4. For each section body, if a child has multiple keys with the exact same string, then the parser will start 
assigning them numbers. 
5. Converting all keys to lower case because it's easier to transcribe in the next stage.

**intermediatetoObjConverter**

1. Values that are in the intermediate CMS object but are not in the Blue Button model are omitted.
2. Values that are in the Blue Button model but are not defined in the CMS object is also omitted. 


## Current Sections 


###Sections that have no data model

BB.js model needs(Bolded are those that are not addressed in the main branch of Blue Button Github site)
Unbolded ones are currently unimplemented but maybe mentioned in bluebutton.


+ **Emergency contacts, kind of pertains to advance directives.**
+ Implantable Devices -> Medical Equipment
+ Family History
+ Preventive Services(future Appointments) -> Plan of Care?
+ Providers -> Payer?
+ Pharmacies
+ Medical Plans -> Plan of Care>
+ **Subsidies**
+ Primary and other Insurances -> Payer
+ **Claim Summary**

### Sections that have a data model
* Demographic -> Demographic(1)(done)
* Self-Reported Medical conditions -> Problems(2)(done)
* Self-Reported Allergies ->Allergies(done)
* Self-Reported Immunizations -> Immunizations(Done)
* Self-Reported Labs and Tests -> Results(Done, need more samples to be better)
* Self-Reported Vital Statistics -> Vitals(Done)
* Drugs -> Medications(done)

##More Issues with Sections

* When there is no 1 to 1 correspondence between sections. For example, in self-reported allergies, 
there are also medications stuff involved. Need to do a better job in detecting that kind of anamaly. 




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
            <-------------------------------------------- this entire piece is referred to as the body
key: value 

key: value 

key: value <------ This is another child

key: value 

key: value 





-------------------------------- <--- dash usually indicates end of section and file

##Testing Plan



###Testing backlog


1. Test Unicode and ASCII, in addition to other text formats(if there are any)-> detection of ascii
2. Test when there are is no source -> need to indicate that there are no sources? Or should add something to indicate no sources?
3. Test if parser can tell which sections are missing -> more like an implementation

###Tests that must be passed for all files

1. Check that there are no blank keys or values.(Done)
2. Object must exist and have type object.(Done)
3. Object must have the number of titles specified in the original test file.(Done)
4. There should be no empty keys in ANY object model.(Done)

###Text file specific test cases

1. Test Empty sections(Done)
2. Test if parser is functional with missing sections(Done)
3. Test empty file(Done)
4. Test source, but no section(Done)
5. Test different number of dashes(Done)
6. Test the file when there is only one section(Done)
7. Test when there is two sections, one from the very beginning and one from the very end.(Done)
8. Test when there is only meta data(Done)



###Task Backlog 


1. Write tests(Partially done)
..+1.a. Check what elements/sections are in CMS.
..+1.b. Check what matches and what doesn't match.
..+1.c. Check what are missing.

2. Document intermediate model. Document which sections match and doesn't match. 


3. Work on parsing from the intermediate model to the actual bb model.
	Start with demographics.

4. Improve code flexibility
	4.a. abstract out matching from code.
		1. separate class for regular expressions.
		2. Detect the format of the text file(UTF-8, ascii), and make it be able to handle different text structures.


5. Putting proper codes for each medical term. May need to put uncoded tag. (
	Look at medical dictionaries/clinical vocabularies at bottom of CCDA pad)

6. Put a tag or some indicator to mark that the source is the CMS text file, or put an object with a key metadata. 

7. Need to make sure that you don't have blank keys(Additional check). 

8. Deal with case sensitivity of keys to object in intermediate object to blue button converter, and everywhere else.


9. Need to dump data that is not part of one section into a common pool, or organize it. 
..* the effective dates for in "demographic" section needs to go somewhere else -> in the health insurance model. 
..* Allergy shots, and other medications need to go to another section

10. Need to make sure that object types are very consistent with the model given in bb, probably will need to write tests to make sure
the returned object model is the same as the model that has been parsed.

11. Need to write the code system functionality to the parser.

12. Need to write defaultValues.json for each section.

13. Need a precision converter, so that if I give it a mm/dd/yyyy/ other options, it can tell how precise it is. 

14. Need to modularize/restructure the results section.

15. Might need an extrapolation layer on top of what is currently here. For example, in the allergy section, it indicated that
the patient took shots. From this, maybe the parser should extrapolate the administration part of medications. May tie in with #13.

16. Make a date precision determining function. 

27. Write tests for parts that are finished.


## Resolved Tasks

1.  Convert datetime into yyyy/mm/dd hh:mm:ss format...(there was no problem in the beginning -.-)

2.  Restructure so that format matches Matt's update.(done)

3. Demographics needs to be able to handle single key value pairs just in case.(Done)

4. writeValue in intermediate object to blue button converter will have to return an object eventually.(done)

##Integration Notes

First, add a line that says: 
In /lib/parser.js,

1. add
	require('(directory structure/CMSparser') or any other packages
2. In the last line of the file, you need to put the key value pair for the new CMSParser package






##Tentative Schedule 

Week of the 10th

+ 6/10/14 Finish writing tests, start on demographics, get to the halfway point with demographics
  * Finished writing most tests, started on demographics. 
+ 6/11/14 Finish writing parser for demographics, start on Allergies
+ 6/12/14 Start on another section, try to finish it in a day
+ 6/13/14 Start on another section, try to finish it in a day

Week of the 16th

6/16/14 Get immunizations done by the end of the day.
6/17/14 Get claims history/insurance started. using the data model that is given in Dmitry's link.
6/18/14 Claims history/insurance data model should be done by today. Make sure to get the model proofread.
Also check CCDA formats for insurers, so that it is compliant with both cms and CCDA.
 Start tackling more problems from the back log, OR
 ..*review CCDA to create more object models(i.e. family history)?
 ..*TDD

6/19/14 Continue tackling major issues in the backlog. 
6/20/14 Clean up and refactor code, re-evaluate current program structure. 


Week of the 23rd

Some time this week: Make up Isabella Jones example from current xml, run that through the parser.
6/23/14 
6/24/14 
6/25/14 
6/26/14
6/27/14

Make sure you know the difference between the "Plans" section vs. "Primary Insurance" section.






