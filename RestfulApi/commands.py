import sqlite3

file = "Sqlite3.db"

def InsertQuestion(category, question, option1, option2, option3, answer, points):
    conn = sqlite3.connect(file)
    cur = conn.cursor()
    print(f"INSERT INTO categories VALUES('{category}', '{question}', '{option1}', '{option2}', '{option3}', '{answer}', '{points}')" )
    query = cur.execute( f"INSERT INTO categories VALUES('{category}', '{question}', '{option1}', '{option2}', '{option3}', '{answer}', '{points}')" )
    conn.commit()
    conn.close()

def UpdateRound(id, totalNumberOfRounds, roundsPlayed, noBuzzer, player1, player1Score, player1Correct, player1Incorrect, player2, player2Score, player2Correct, player2Incorrect, player3, player3Score, player3Correct, player3Incorrect):
    conn = sqlite3.connect(file)
    cur = conn.cursor()
    query = cur.execute( f"REPLACE INTO game VALUES('{id}', '{totalNumberOfRounds}', '{roundsPlayed}', '{noBuzzer}', '{player1}', '{player1Score}', '{player1Correct}', '{player1Incorrect}', '{player2}', '{player2Score}', '{player2Correct}', '{player2Incorrect}', '{player3}', '{player3Score}', '{player3Correct}', '{player3Incorrect}')" )
    conn.commit()
    conn.close()

def GetRound(id):
    conn = sqlite3.connect(file)
    cur = conn.cursor()
    query = cur.execute( f"SELECT * FROM game WHERE id = {id}" )
    conn.commit()
    conn.close()
