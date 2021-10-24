from flask import Flask,render_template, url_for, request
from flask_restful import Resource, Api
from sqlalchemy import create_engine
from json import dumps
import sqlite3
import math

file = "Sqlite3.db"



app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
	return render_template('index.html')

def calculate_qtc(form):
	try:
		category = request.form['categories']
		question = request.form['question']
		option1  = request.form['option1']	
		option2  = request.form['option2']	
		option3  = request.form['option3']
		answer   = request.form['answer']
		points   = request.form['points']
		
		conn = sqlite3.connect(file)
		cur = conn.cursor()
		query = cur.execute( f"""INSERT INTO categories VALUES("{category}", "{question}", "{option1}", "{option2}", "{option3}", "{answer}", "{points}")""" )
		conn.commit()
		conn.close()
	except Exception as e:
		print(e)
		return (0,True)
	print("Success")
	return (0, False)    
    
api = Api(app)

class Categories(Resource):
	def get(self):
		try:
			conn = sqlite3.connect(file)
			cur = conn.cursor()
		except Exception as e:
			print(e)
			quit()
		query = cur.execute("select * from categories")
		rows = query.fetchall()
		return rows

@app.route('/add', methods = ['GET', 'POST'])
def add():
    QTc_result = False
    if request.method == 'POST':
        form = request.form
        QTc_result = calculate_qtc(form)
    return render_template('questions_adder.html', QTc_result=QTc_result)

@app.route('/view', methods=['GET'])
def view():
    try:
        conn = sqlite3.connect(file)
        cur = conn.cursor()
        query = cur.execute("select * from categories")
        questions = query.fetchall()
        print(str(questions))
        return render_template('questions_viewer.html', questions=questions)
    except Exception as e:
        print(e)

@app.route('/clean', methods = ['GET'])
def clean():
    try:
        conn = sqlite3.connect(file)
        cur = conn.cursor()
    except Exception as e:
        print(e)
    return ('done')

# api.add_resource(Categories, '/categories')


if __name__ == '__main__':
	app.run(port = '5002', host='0.0.0.0')

