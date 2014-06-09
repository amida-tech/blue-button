## Introduction
This script converts CCDA data in JSON format (originally generated from a Continuity of Care Document (CCD) in 
standard XML/CCDA format) back to XML/CCDA format. In order to re-build the CCD accurately, the script determines the 
section template to which the data belongs to by analyzing its value set codes. In other words, if the JSON data contains a value set belonging to a certain section, then it must belong to that section since different sections do not have the same value sets.

For example, if the JSON data contains an entry with a code of 8302-2 (which belongs to the value set "Height"), then that entry must be a descendant of the Vital Signs section template since the Vital Signs section contains such a value set, as specified by the CCDA standard (available at http://www.hl7.org/implement/standards/product_brief.cfm?product_id=258).

Once the section template is determined, an XML document is generated using the libxmljs Document API and passing in the appropriate XML attributes for the section template determined previously.

## Acquiring the Lookup Data
The data is acquired from http://phinvads.cdc.gov/vads/SearchVocab.action. There are two slightly different data sets which you can download. The first is option is the following: Value Sets > Browse All Value Sets > Download All. The second option is View(Msg. Guides) > Browse All Views > Click Details on the All Value Sets Row > Download All. The first option contains value sets from FHIM and NHSN, among others, in addition to the standard ones from PHVS. After downloading the files, make sure to remove either "ValueSetBrowseResultSummary.xls" or "Views\View_All_Value_Sets_V7.xls" from your directory before proceeding.

Once having completed the above, execute the ruby batch conversion script from the command line in the same directory as your downloaded files (WARNING: this will take a considerable amount of time to process the files, ~2-3hrs). 

When the script has finished running, execute the following Unix commands in the terminal:

~~~~
cat *.csv > final.csv
COUNT=`grep "Concept\sCode" -Hnm 1 final.csv |cut -f2 -d:` 
COUNT=`expr $COUNT - 1`
awk '/Concept Code/&&c++ {next} 1' final.csv > finalRevised.csv
~~~~

This results in a CSV file (~300mb file) with the following headers:

"Concept Code","Concept Name","Preferred Concept Name","Preferred Alternate Code","Code System OID","Code System Name","Code System Code","Code System Version","HL7 Table 0396 Code","Value Set Name","Value Set Code","Value Set OID","Value Set Version","Value Set Definition","Value Set Status","VS Last Updated Date","VS Release Comments"
