import json
from string import Template

f=open("stats.js","r")
data = f.read()

js = json.loads(data)

#print js

header="""
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <!--link rel="shortcut icon" href="../../assets/ico/favicon.ico"-->

    <title>Starter Template for Bootstrap</title>

    <!-- Bootstrap core CSS -->
    <link href="bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="starter-template.css" rel="stylesheet">

    <!-- Just for debugging purposes. Don't actually copy this line! -->
    <!--[if lt IE 9]><script src="../../assets/js/ie8-responsive-file-warning.js"></script><![endif]-->

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>

  <body>

    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Project name</a>
        </div>
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li class="active"><a href="#">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </div>

    <div class="container">
      <div class="starter-template">
        <h1>blue-button.js CCDA samples results</h1>
        <p class="lead">Use this document as a way to quickly start any new project.<br> All you get is this text and a mostly barebones HTML document.</p>



"""

footer="""

      </div>

    </div><!-- /.container -->


    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
  </body>
</html>

"""


body=Template("""
        <div class="panel panel-default">
		  <div class="panel-heading">
		    <h3 class="panel-title"> $vendor </h3>
		  </div>

		  <table class="table">
		  	<thead>
		  		<tr>
		  		<th>File name</th>
		  		<th>Sections</th>
		  		<th>Demo graph ics</th>
		  		<th>Pro ce du res</th>
		  		<th>So cial Hist ory</th>
		  		<th>Aller gies</th>
		  		<th>En coun ters</th>
		  		<th>Meds</th>
		  		<th>Pro ble ms</th>
		  		<th>Imm mu ni za ti ons</th>
		  		<th>Vi tal s</th>
		  		<th>Re sul ts</th>
		  		</tr>
		  	</thead>
		  	$files
		  </table>

		</div>
""")


def pf(boo):
	if boo:
		return """<a href="" class="label label-success">Success</a>"""
	else:
		return """<a href="" class="label label-danger">Fail</a>"""

#<span class="glyphicon glyphicon-ok"></span>
#<span class="glyphicon glyphicon-remove"></span>
#<a href="" class="label label-success">Success</a>
#<a href="" class="label label-danger">Fail</a>

filet=Template("""
		  	<tr>
		  		<td> $full $filename  <span class="label label-warning">$doctype</span> </td>
		  		<td> $tags </td>
		  		<td> $demo </td>
		  		<td> $pro </td>
		  		<td> $so </td>
		  		<td> $all </td>
		  		<td> $en </td>
		  		<td> $me </td>
		  		<td> $pbs </td>
		  		<td> $im </td>
		  		<td> $vi </td>
		  		<td> $re </td>
		  	</tr>
""")

tagst=Template("""<span class="label label-primary"> $tag </span> """)

bodies=""
for item in js:
	params={}
	params["vendor"]=item
	files=""

	#iterate throug all files for one vendor
	for i, f in enumerate(js[item]["files"]):
		params2={}
		tags=""
		print i, f
		params2["filename"]=f
		params2["doctype"]=js[item]["sections"][i]["template"]

		for sections in js[item]["sections"][i]["xml_sections"]:
			tags=tags+" &nbsp; "+tagst.substitute({"tag":sections[0:2]})

		params2["tags"]=tags

                #"full": false,
                #"ccda_demographics": true,
                #"ccda_procedures": false,
                #"ccda_socialHistory": true,
                #"ccda_allergies": false,
                #"ccda_encounters": true,
                #"ccda_medications": false,
                #"ccda_problems": true,
                #"ccda_imunizations": true,
                #"ccda_vitals": true,
                #"ccda_results": true

		params2["demo"]=pf(js[item]["sections"][i]["ccda_demographics"])
		params2["pro"]=pf(js[item]["sections"][i]["ccda_procedures"])
		params2["so"]=pf(js[item]["sections"][i]["ccda_socialHistory"])
		params2["all"]=pf(js[item]["sections"][i]["ccda_allergies"])
		params2["en"]=pf(js[item]["sections"][i]["ccda_encounters"])
		params2["me"]=pf(js[item]["sections"][i]["ccda_medications"])
		params2["pbs"]=pf(js[item]["sections"][i]["ccda_problems"])
		params2["im"]=pf(js[item]["sections"][i]["ccda_imm'unizations"])
		params2["vi"]=pf(js[item]["sections"][i]["ccda_vitals"])
		params2["re"]=pf(js[item]["sections"][i]["ccda_results"])
		params2["full"]=pf(js[item]["sections"][i]["full"])

		files=files+"\n"+filet.substitute(params2)


	params["files"]=files	

	bodies=bodies+"\n"+body.substitute(params)


fo = open("index_py.html","w")

fo.write(header)

fo.write(bodies)

fo.write(footer)