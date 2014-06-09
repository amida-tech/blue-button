#!/usr/bin/env ruby
require 'rubygems'
require 'spreadsheet'
require 'roo'

Spreadsheet.client_encoding = 'UTF-8'
pwd       = File.dirname(__FILE__)

# Dir.glob("#{pwd}/*.xls") do |file|
#   file_path = "#{pwd}/#{file}"  
#   file_basename = File.basename(file, ".xls")  
#   xls = Roo::Excel.new(file_path)
#   xls.longest_sheet.to_csv("#{pwd}/#{file_basename}.csv")
# end

Dir.glob("#{pwd}/*.xls") do |file|
	file_path = "#{pwd}/#{file}"  
  file_basename = File.basename(file, ".xls")  

	book1 = Spreadsheet.open file_path
	book2 = Spreadsheet::Workbook.new
	book2sheet1 = book2.create_worksheet

	# headers array
  book1sheetheaders = []

  # worksheets for existing xls file
  book1sheet1 = book1.worksheet 0
  book1sheet2 = book1.worksheet 1

	# push columns for code system concepts worksheet
  book1sheet2.row(0).each do |header|
  	book1sheetheaders << header
  end

  # push columns for value sets worksheet
  book1sheet1.row(0).each do |header|
  	book1sheetheaders << header
  end

  # push headers onto first row of new worksheet
  book1sheetheaders.each do |h|
  	book2sheet1.row(0).push h
	end

	# get the number of section concepts in the input worksheet
	count = 0
	book1sheet2.each do |row| 
		count = count+1
	end

	# modify the output worksheet with the input worksheet data
	(1..count-2).each do |i|
		book1sheet2.row(i).each do |cell|
			book2sheet1.row(i).push cell
		end
		book1sheet1.row(1).each do |cell|
			book2sheet1.row(i).push cell
		end
	end
	
	book2.write "#{pwd}/#{file_basename}_out.xls"

	xls = Roo::Excel.new("#{pwd}/#{file_basename}_out.xls")
  xls.longest_sheet.to_csv("#{pwd}/#{file_basename}.csv")
	end