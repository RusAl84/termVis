from rutermextract import TermExtractor
import pymorphy2
import codecs
import os
import sys
#Проверка, есть ли файл в директории(Был ли он получен)
if not os.path.isfile('text.txt'):
    print('text file not exist')
    sys.exit()
if not os.path.exists('term_out'):
    os.mkdir('term_out')
print(123)
morph = pymorphy2.MorphAnalyzer()
text_file = codecs.open('text.txt',encoding = 'utf-8', mode ='r')
text = text_file.read()
text = str(text)
text_file.close()
#Формирование словаря(тезауруса)
f = codecs.open('term_out\out.csv', 'w', encoding='utf-8')
f.write(u'phrase' + ',' + 'count' + ',' + 'POS' + ',' + 'case' + ',' + 'number' + ',' + 'gender' + ',' + 'person' +'\n')
#Извлечение ключевых слов и прочих параментров
term_extractor = TermExtractor()
for term in term_extractor(text):
    f.write(term.normalized + ',' + str(term.count))
    if term.word_count == 1:
        t = morph.parse(term.normalized)[0]
        f.write(u',' + str(t.tag.POS) + ',' + str(t.tag.case) + ',' + str(t.tag.number) + ',' + str(t.tag.gender) + ',' + str(t.tag.person))
    else:
        f.write(u',' + 'phrase' + ',' + "" + ',' + "" + ',' + "" + ',' + "")
    f.write('\n')       
f.close()