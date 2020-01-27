#!/usr/bin/env python3
import cgi, cgitb
import html
import codecs
import os
import sys

form = cgi.FieldStorage()
text = form.getcontent('textcontent')
print(text)
text = str(text)
f = codecs.open('text.txt', 'w', encoding='utf-8')
f.write(text)
f.close()