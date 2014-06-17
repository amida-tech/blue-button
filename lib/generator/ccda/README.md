## Introduction
This script converts CCDA data in JSON format (originally generated from a Continuity of Care Document (CCD) in 
standard XML/CCDA format) back to XML/CCDA format. In order to re-build the CCD accurately, the script determines the 
section template to which the data belongs to by analyzing its value set codes. In other words, if the JSON data contains a value set belonging to a certain section, then it must belong to that section since different sections do not have the same value sets.

For example, if the JSON data contains an entry with a code of 8302-2 (which belongs to the value set "Height"), then that entry must be a descendant of the Vital Signs section template since the Vital Signs section contains such a value set, as specified by the CCDA standard (available at http://www.hl7.org/implement/standards/product_brief.cfm?product_id=258).

Once the section template is determined, an XML document is generated using the libxmljs Document API and passing in the appropriate XML attributes for the section template determined previously.


