from bs4 import BeautifulSoup
import requests
import string

import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import numpy as np

def add_commas(s, words):
  # Split the string into a list of words
  words_list = s.split()

  # Initialize an empty result list
  result = []

  # Iterate over the list of words
  for i, word in enumerate(words_list):
    # Append the current word to the result list
    result.append(word)

    # Check if the current word or the current word and the next word exist in the array
    if i < len(words_list) - 1:
      if word + ' ' + words_list[i+1] in words or word in words:
        # If they do, add a comma after the current word
        result.append(',')

  # Return the result list as a comma-separated string
  return result

url = input("Please input a programe page to scrape, page must be in english: ")
page = requests.get(url)
soup = BeautifulSoup(page.text, "html.parser")

courseData = [[]]

specialisations = []
courseCode = []
courseName = []
courseLink = []
credits = []
level = []
timetableModule = []
ecv = [[]]
examForm = []
multiPeriod = []
fields = [[]]
term = []
listOfFields = []

programIndex = url.find("program/")
if(len(url) > programIndex+8+5):
    programName = (url[programIndex+8:programIndex+8+5] + "-" + url[-4:])
else:
    programName = (url[programIndex+8:programIndex+8+5])
print("Fetching: ", programName)

specSelect = soup.find_all("select", class_="specializations-filter")

for sel in specSelect:
    sel.find_all("option")
    #print("Found option")
    for data in sel:
        specText = data.getText().strip()
        if specText != "" and specText != "All":
            specialisations.append(specText)
print("Found " + str(len(specialisations)) + " specializations")

fieldSelect = soup.find_all("select", class_="field-of-study-filter")

for field in fieldSelect:
    field.find_all("option")
    #print("Found option")
    for data in field:
        fieldText = data.getText().strip()
        if fieldText != "" and fieldText != "All":
            listOfFields.append(fieldText)
print("Found " + str(len(listOfFields)) + " fields of studies")

numRows = soup.find_all("tr", class_="main-row")
print("Iterating through " + str(len(numRows)) + " rows of data")

for row in numRows:
    courseRowData = row.find_all("td")
    dataCounter = 0
    for data in courseRowData:
        #print(len(data))
        #courseData.append([data[1].getText()])
        
        dataCounter+=1
        #print("data:", data.getText())

        if dataCounter == 1: # Get course code
            courseCode.append(data.getText())
        elif dataCounter == 2: # Get course name and link to page
            fixedName = " ".join(data.getText().split())
            courseName.append(fixedName)
            
            link = data.find("a", href=True)
            completeLink = "https://studieinfo.liu.se" + link['href']
            courseLink.append(completeLink)
            if "ht" in completeLink[-7:] or "vt" in completeLink[-7:]: 
                term.append(completeLink[-7:])
            else:
                term.append("-")
        elif dataCounter == 3: # Get course credits
            credits.append(data.getText())
        elif dataCounter == 4: # Get course level
            level.append(data.getText())
        elif dataCounter == 5: # Get course Timetable module
            timetableModule.append(data.getText())

print("Done scraping main table")

for link in courseLink: # Go through all courses individual webpage
    coursePage = requests.get(link)
    pageCrawl = BeautifulSoup(coursePage.text, "html.parser")

    examTable = pageCrawl.find("table", class_="examinations-codes-table")
    examTableRow = examTable.find_all("tr")
    #print(examTableRow())
    row = 0
    for examData in examTableRow:
        row += 1
        #print("Row " + str(row) + " of " + str(len(examTableRow)))
        if(row>1):
            examType = examData.getText()[1] + examData.getText()[2] + examData.getText()[3]
            if examType == "TEN":
                examForm.append(True)
                break
            elif row == len(examTableRow):
                examForm.append(False)

    fieldHeading = pageCrawl.find("h2", text="Main field of study")
    fieldText = fieldHeading.next_sibling
    fixedFieldText = " ".join(fieldText.getText().split())
    #print(fixedFieldText)
    #fieldArray = add_commas(fixedFieldText, listOfFields)
    fields.append(fixedFieldText)

    ecvTable = pageCrawl.find("table", class_="study-guide-table")
    ecvTableRow = ecvTable.find_all("tr")

    row = 0
    tempECV = []
    for ecvData in ecvTableRow:
        row += 1
        if(row>1):
            if (ecvData.find('td').contents[0] == programName):
                if (ecvData.find_all('td')[1].find('a').contents[0].find("(") != -1):
                    completeSpec = ecvData.find_all('td')[1].find('a').contents[0]
                    specIndex = completeSpec.find("(")
                    tempECV.append({completeSpec[specIndex+1:-1]: ecvData.find_all('td')[7].find('span').contents[0].translate({ord(c): None for c in string.whitespace})})
                    #print(ecvData.find_all('td')[7].find('span').contents[0].translate({ord(c): None for c in string.whitespace}) + " for " + completeSpec[specIndex+1:-1])
                else:
                    tempECV.append({"Other": ecvData.find_all('td')[7].find('span').contents[0].translate({ord(c): None for c in string.whitespace})})
                    #ecv.append(['*', ecvData.find_all('td')[7].find('span').contents[0].translate({ord(c): None for c in string.whitespace})])
                    #print(ecvData.find_all('td')[7].find('span').contents[0].translate({ord(c): None for c in string.whitespace}) + " for all specializations")
    ecv.append(tempECV)

print("Done adding exam form and ecv data")

print("code: ", len(courseCode))
print("name: ", len(courseName))
print("exam: ", len(examForm))
print("credits: ", len(credits))
print("level: ", len(level))
print("ttm: ", len(timetableModule))
print("ecv", len(ecv))
print("fields", len(fields))

for index, credit in enumerate(credits):
    if "*" in credit:
        multiPeriod.append(True)
        #credits[index] = credit[:-1]
    else:
        multiPeriod.append(False)
print("Done with checking for multiple periods")

for i, course in enumerate(courseCode):
    #print(i)
    courseData.append({"code": courseCode[i], "link": courseLink[i], "name": courseName[i], "exam": examForm[i], "credits": credits[i], "multiplePeriods": multiPeriod[i], "level": level[i], "fields": fields[i], "timetableModule": timetableModule[i], "term": term[i], "ecv": ecv[i]})
courseData.pop(0)

#print(courseData[10])
print("Starting upload to firebase...")

# Upload to firebase
colPath = "programmes"

cred = credentials.Certificate("../../liu-masterpicker-firebase.json")
app = firebase_admin.initialize_app(cred)

store = firestore.client()

collection_name = programName + "-" +term[0]

batch = store.batch()
programData_ref = store.collection(colPath).document(collection_name)
start_term = term[0]
program_data = {"term": start_term, "specializations": specialisations, "fields": listOfFields}
#print(program_data)
batch.set(programData_ref, program_data)

for course in courseData:
#course = courseData[0]
    print(course)
    doc_ref = store.collection(colPath).document(collection_name).collection("courses").document()
    batch.set(doc_ref, course)
batch.commit()

print("Done with upload")

