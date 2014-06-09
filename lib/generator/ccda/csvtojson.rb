#!/usr/bin/env ruby
require 'rubygems'
require 'csv'
require 'json'


pwd       = File.dirname(__FILE__)

# take the csv input file
Dir.glob("#{pwd}/#{ARGV[0]}.csv") do |file|
  # now convert to two data structures: section name => value set and 
  # values => section name

  table = CSV.read(file)
  headers = table[0] # set the headers to be the headers in the csv file
  output = {} # declare a hash to store json output
  for row in table[1..table.length-1] # iterate over 
  	j = {}
  	row.each_with_index do |val, i|
  		j[headers[i]] = val
  	end
  	output[row[0]] = j
  end

  puts JSON.generate(output)
  
end