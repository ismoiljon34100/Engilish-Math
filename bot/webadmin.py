"""
IELTS Bot — Xavfsiz Web Admin Panel
Flask orqali ishlaydi, users.db va activity_log ma'lumotlaridan foydalanadi.
"""

import os
import time
import secrets
import sqlite3
from functools import wraps
from datetime import datetime

from flask import Flask, request, session, jsonify, render_template_string, redirect

DB_PATH = os.path.join(os.path.dirname(__file__), "users.db")
WEBADMIN_PASSWORD = os.environ.get("WEBADMIN_PASSWORD", "6221991")

app = Flask(__name__)
app.secret_key = secrets.token_hex(32)
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Strict"

failed_attempts = {}  # ip -> {"count": int, "locked_until": timestamp}


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if not session.get("authed"):
            return redirect("/")
        return f(*args, **kwargs)
    return wrapper


def api_login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if not session.get("authed"):
            return jsonify({"error": "unauthorized"}), 401
        return f(*args, **kwargs)
    return wrapper


LOGIN_PAGE = """
<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Admin Kirish</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: radial-gradient(circle at 30% 20%, #1a1f3a, #0a0c18 70%);
    font-family: 'Segoe UI', system-ui, sans-serif; color: #e8e8f0;
  }
  .card {
    background: rgba(255,255,255,0.04); backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.08); border-radius: 20px;
    padding: 48px 40px; width: 340px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }
  .logo { text-align: center; font-size: 40px; margin-bottom: 8px; }
  h1 { text-align: center; font-size: 20px; font-weight: 600; margin: 0 0 28px; color: #fff; }
  input {
    width: 100%; padding: 14px 16px; margin-bottom: 16px; border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.06);
    color: #fff; font-size: 15px; outline: none; transition: border 0.2s;
  }
  input:focus { border-color: #6c7bff; }
  button {
    width: 100%; padding: 14px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #6c7bff, #a06cff); color: #fff;
    font-size: 15px; font-weight: 600; cursor: pointer; transition: opacity 0.2s;
  }
  button:hover { opacity: 0.9; }
  .error { color: #ff6b6b; text-align: center; font-size: 13px; margin-top: 14px; min-height: 18px; }
</style>
</head>
<body>
  <div class="card">
    <div class="logo">🔐</div>
    <h1>Admin Panelga Kirish</h1>
    <form id="loginForm">
      <input type="password" id="password" placeholder="Parol" autofocus required>
      <button type="submit">Kirish</button>
      <div class="error" id="errorMsg">{{ error_msg }}</div>
    </form>
  </div>
<script>
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const password = document.getElementById('password').value;
  const res = await fetch('/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({password})
  });
  const data = await res.json();
  if (data.ok) {
    window.location.href = '/dashboard';
  } else {
    document.getElementById('errorMsg').textContent = data.error || 'Xatolik yuz berdi';
  }
});
</script>
</body>
</html>
"""

DASHBOARD_PAGE = """
<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>IELTS Bot — Admin Dashboard</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; height: 100vh; display: flex;
    background: #0a0c18; font-family: 'Segoe UI', system-ui, sans-serif; color: #e8e8f0;
    overflow: hidden;
  }
  .sidebar {
    width: 320px; background: rgba(255,255,255,0.03); border-right: 1px solid rgba(255,255,255,0.08);
    display: flex; flex-direction: column; overflow-y: auto;
  }
  .sidebar-header {
    padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: space-between;
  }
  .sidebar-header h2 { font-size: 16px; margin: 0; color: #fff; }
  .logout-btn { color: #ff6b6b; text-decoration: none; font-size: 13px; }
  .user-item {
    padding: 14px 20px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s;
  }
  .user-item:hover { background: rgba(255,255,255,0.04); }
  .user-item.active { background: rgba(108,123,255,0.15); border-left: 3px solid #6c7bff; }
  .user-name { font-weight: 600; font-size: 14px; color: #fff; }
  .user-meta { font-size: 12px; color: #8b8fa3; margin-top: 4px; }
  .online-dot {
    display: inline-block; width: 8px; height: 8px; border-radius: 50%;
    background: #4ade80; margin-right: 6px; box-shadow: 0 0 6px #4ade80;
  }
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .main-header {
    padding: 20px 28px; border-bottom: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: space-between;
  }
  .main-header h2 { margin: 0; font-size: 18px; color: #fff; }
  .main-header .sub { font-size: 13px; color: #8b8fa3; margin-top: 4px; }
  .timeline { flex: 1; overflow-y: auto; padding: 24px 28px; }
  .entry {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px; padding: 16px 18px; margin-bottom: 12px;
  }
  .entry .action {
    display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase;
    padding: 3px 10px; border-radius: 20px; background: rgba(108,123,255,0.2); color: #a6b0ff;
    margin-bottom: 8px;
  }
  .entry .time { float: right; font-size: 12px; color: #6b7080; }
  .entry .content { font-size: 14px; line-height: 1.5; white-space: pre-wrap; color: #d6d8e6; }
  .empty { text-align: center; color: #6b7080; margin-top: 60px; font-size: 14px; }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
</style>
</head>
<body>
  <div class="sidebar">
    <div class="sidebar-header">
      <h2>👥 Foydalanuvchilar</h2>
      <a href="/logout" class="logout-btn">Chiqish</a>
    </div>
    <div id="userList"></div>
  </div>
  <div class="main">
    <div class="main-header">
      <div>
        <h2 id="mainTitle">Foydalanuvchini tanlang</h2>
        <div class="sub" id="mainSub"></div>
      </div>
    </div>
    <div class="timeline" id="timeline">
      <div class="empty">Chapdan foydalanuvchi tanlang</div>
    </div>
  </div>

<script>
let selectedUserId = null;

function timeAgo(isoStr) {
  if (!isoStr) return '';
  const diff = (Date.now() - new Date(isoStr + 'Z').getTime()) / 1000;
  if (diff < 60) return 'hozir';
  if (diff < 3600) return Math.floor(diff/60) + ' daqiqa oldin';
  if (diff < 86400) return Math.floor(diff/3600) + ' soat oldin';
  return Math.floor(diff/86400) + ' kun oldin';
}

async function loadUsers() {
  const res = await fetch('/api/users');
  if (res.status === 401) { window.location.href = '/'; return; }
  const users = await res.json();
  const container = document.getElementById('userList');
  container.innerHTML = '';
  users.forEach(u => {
    const isOnline = (Date.now() - new Date(u.last_seen + 'Z').getTime()) < 120000;
    const div = document.createElement('div');
    div.className = 'user-item' + (u.user_id === selectedUserId ? ' active' : '');
    div.onclick = () => selectUser(u.user_id, u.username);
    div.innerHTML = `
      <div class="user-name">${isOnline ? '<span class="online-dot"></span>' : ''}@${u.username || 'nomalum'}</div>
      <div class="user-meta">ID: ${u.user_id} • ${u.count} harakat • ${timeAgo(u.last_seen)}</div>
    `;
    container.appendChild(div);
  });
}

async function selectUser(userId, username) {
  selectedUserId = userId;
  document.getElementById('mainTitle').textContent = '@' + (username || 'nomalum');
  document.getElementById('mainSub').textContent = 'ID: ' + userId;
  loadTimeline();
  loadUsers();
}

async function loadTimeline() {
  if (!selectedUserId) return;
  const res = await fetch('/api/users/' + selectedUserId);
  if (res.status === 401) { window.location.href = '/'; return; }
  const data = await res.json();
  const container = document.getElementById('timeline');
  if (!data.entries.length) {
    container.innerHTML = '<div class="empty">Hali harakat yo\\'q</div>';
    return;
  }
  container.innerHTML = data.entries.map(e => `
    <div class="entry">
      <span class="time">${e.created_at.replace('T', ' ').slice(0, 16)}</span>
      <div class="action">${e.action}</div>
      <div class="content">${e.detail}</div>
    </div>
  `).join('');
}

loadUsers();
setInterval(loadUsers, 6000);
setInterval(loadTimeline, 4000);
</script>
</body>
</html>
"""


@app.route("/")
def login_page():
    if session.get("authed"):
        return redirect("/dashboard")
    return render_template_string(LOGIN_PAGE, error_msg="")


@app.route("/login", methods=["POST"])
def login():
    ip = request.remote_addr
    now = time.time()

    entry = failed_attempts.get(ip, {"count": 0, "locked_until": 0})
    if now < entry["locked_until"]:
        remaining = int(entry["locked_until"] - now)
        return jsonify({"ok": False, "error": f"Juda ko'p urinish. {remaining} soniyadan keyin qayta urining."})

    data = request.get_json(force=True)
    password = data.get("password", "")

    if password == WEBADMIN_PASSWORD:
        failed_attempts.pop(ip, None)
        session["authed"] = True
        session.permanent = False
        return jsonify({"ok": True})
    else:
        entry["count"] += 1
        if entry["count"] >= 5:
            entry["locked_until"] = now + 300
            entry["count"] = 0
        failed_attempts[ip] = entry
        return jsonify({"ok": False, "error": "Noto'g'ri parol"})


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


@app.route("/dashboard")
@login_required
def dashboard():
    return render_template_string(DASHBOARD_PAGE)


@app.route("/api/users")
@api_login_required
def api_users():
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        """
        SELECT user_id, username, COUNT(*) as cnt, MAX(created_at) as last_seen
        FROM activity_log
        GROUP BY user_id
        ORDER BY last_seen DESC
        """
    )
    rows = cur.fetchall()
    conn.close()
    return jsonify([
        {
            "user_id": r["user_id"],
            "username": r["username"] or "",
            "count": r["cnt"],
            "last_seen": r["last_seen"],
        }
        for r in rows
    ])


@app.route("/api/users/<int:user_id>")
@api_login_required
def api_user_detail(user_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "SELECT action, detail, created_at FROM activity_log "
        "WHERE user_id = ? ORDER BY created_at DESC LIMIT 100",
        (user_id,),
    )
    rows = cur.fetchall()
    conn.close()
    return jsonify({
        "entries": [
            {"action": r["action"], "detail": r["detail"], "created_at": r["created_at"]}
            for r in rows
        ]
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5050))
    print(f"Web Admin Panel port: {port}")
    app.run(host="0.0.0.0", port=port, debug=False)
