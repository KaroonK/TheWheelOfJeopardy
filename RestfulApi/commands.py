import sqlite3

file = "WheelOfJeopardy.db"

def InsertQuestion(category, question, option1, option2, option3, answer, points):
    conn = sqlite3.connect(file)
    cur = conn.cursor()
    print(f"INSERT INTO categories VALUES('{category}', '{question}', '{option1}', '{option2}', '{option3}', '{answer}', '{points}')" )
    query = cur.execute( f"INSERT INTO categories VALUES('{category}', '{question}', '{option1}', '{option2}', '{option3}', '{answer}', '{points}')" )
    rowCount = query.rowcount
    conn.commit()
    conn.close()
    return rowCount

def GetQuestions(category):
    conn = sqlite3.connect(file)
    cur = conn.cursor()
    query = cur.execute( f"SELECT * FROM questions WHERE category = '{category}'")
    rows = query.fetchall()
    conn.commit()
    conn.close()
    return rows


def UpdateGame(id, totalNumberOfRounds, roundsPlayed, noBuzzer, player1, player1Score, player1Correct, player1Incorrect, player2, player2Score, player2Correct, player2Incorrect, player3, player3Score, player3Correct, player3Incorrect):
    conn = sqlite3.connect(file)
    cur = conn.cursor()
    query = cur.execute( f"REPLACE INTO game VALUES('{id}', '{totalNumberOfRounds}', '{roundsPlayed}', '{noBuzzer}', '{player1}', '{player1Score}', '{player1Correct}', '{player1Incorrect}', '{player2}', '{player2Score}', '{player2Correct}', '{player2Incorrect}', '{player3}', '{player3Score}', '{player3Correct}', '{player3Incorrect}')" )
    rowCount = query.rowcount
    conn.commit()
    conn.close()
    return rowCount

def GetGame(id):
    conn = sqlite3.connect(file)
    cur = conn.cursor()
    query = cur.execute( f"SELECT * FROM game WHERE id = {id}" )
    rows = query.fetchall();
    conn.commit()
    conn.close()
    return rows


def GetLeaderBoard():
    conn = sqlite3.connect(file)
    cur = conn.cursor()
    query = cur.execute("SELECT * FROM v_leaderboard" )
    rows = query.fetchall()
    conn.commit()
    conn.close()
    return rows


#print(GetRound(10))
#print(GetQuestions(1))
#print(UpdateRound(10, 1, 1, 1, 1, 499, 1, 1, 2, 1, 1, 1, 3, 130, 3, 3))
print(GetLeaderBoard())
#print(GetRound(10))
