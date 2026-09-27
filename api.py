"""
IELTS Bot — Admin Panel uchun API server
SPEC.md 5-bo'limidagi kontraktlarga mos.
"""

import sqlite3
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DB_PATH = "users.db"


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@app.route("/api/students")
def get_students():
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT
            user_id,
            username,
            COUNT(*) as submissions_count,
            AVG(band_score) as avg_band,
            MAX(created_at) as last_active
        FROM submissions
        GROUP BY user_id
        ORDER BY last_active DESC
        """
    )
    rows = cur.fetchall()
    conn.close()

    students = []
    for row in rows:
        students.append({
            "id": row["user_id"],
            "name": row["username"] or f"User {row['user_id']}",
            "username": row["username"] or "",
            "avg_band": round(row["avg_band"], 1) if row["avg_band"] else 0,
            "streak_days": 0,
            "submissions_count": row["submissions_count"],
            "last_active": row["last_active"],
        })

    return jsonify(students)


@app.route("/api/students/<int:user_id>/history")
def get_history(user_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT created_at, task_type, band_score
        FROM submissions
        WHERE user_id = ?
        ORDER BY created_at ASC
        """,
        (user_id,),
    )
    rows = cur.fetchall()
    conn.close()

    history = [
        {
            "date": row["created_at"][:10],
            "task_type": row["task_type"],
            "band": row["band_score"],
        }
        for row in rows
    ]
    return jsonify(history)


@app.route("/api/students/<int:user_id>/submissions")
def get_submissions(user_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, task_type, essay, band_score, created_at
        FROM submissions
        WHERE user_id = ?
        ORDER BY created_at DESC
        """,
        (user_id,),
    )
    rows = cur.fetchall()
    conn.close()

    submissions = [
        {
            "id": row["id"],
            "task_type": row["task_type"],
            "essay": row["essay"],
            "band_score": row["band_score"],
            "created_at": row["created_at"],
        }
        for row in rows
    ]
    return jsonify(submissions)


@app.route("/api/students/<int:user_id>/submissions/<int:submission_id>")
def get_submission_detail(user_id, submission_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT id, task_type, essay, band_score, created_at
        FROM submissions
        WHERE id = ? AND user_id = ?
        """,
        (submission_id, user_id),
    )
    row = cur.fetchone()
    conn.close()

    if row is None:
        return jsonify({"error": "Not found"}), 404

    return jsonify({
        "id": row["id"],
        "task_type": row["task_type"],
        "essay": row["essay"],
        "band_score": row["band_score"],
        "created_at": row["created_at"],
    })


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
