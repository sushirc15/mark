"""
Vercel Serverless Function Handler for Mashmanos API
"""
from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.parse
from datetime import datetime
import shutil

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DATA_FILE = os.path.join(BASE_DIR, "data.json")
TMP_DATA_FILE = "/tmp/data.json"

ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "mash123")
ADMIN_TOKEN = "mash_token_sec_9998124"

def get_data_file():
    if os.path.exists(TMP_DATA_FILE):
        return TMP_DATA_FILE
    return SRC_DATA_FILE

def load_data():
    file_path = get_data_file()
    try:
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    # Fallback to source
    if os.path.exists(SRC_DATA_FILE):
        with open(SRC_DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_data(data):
    # Try writing to /tmp first (writable on Vercel)
    try:
        with open(TMP_DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Notice: /tmp write: {e}")
    # Try writing to local data.json if filesystem allows
    try:
        with open(SRC_DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception:
        pass # Read-only on serverless

class handler(BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def get_client_ip(self):
        forwarded = self.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return self.client_address[0] if hasattr(self, 'client_address') and self.client_address else "127.0.0.1"

    def read_json_body(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length <= 0:
                return {}
            raw_data = self.rfile.read(content_length).decode("utf-8")
            return json.loads(raw_data)
        except Exception:
            return {}

    def send_json(self, data, status=200):
        response_bytes = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(response_bytes)))
        self.end_headers()
        self.wfile.write(response_bytes)

    def is_admin(self, auth_header):
        if not auth_header:
            return False
        token = auth_header.replace("Bearer ", "").strip()
        return token == ADMIN_TOKEN or token == ADMIN_PASSWORD

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path.endswith("/api/state") or path == "/api/state":
            app_data = load_data()
            total = app_data.get("voting_status", {}).get("total_votes", 0)
            slots = app_data.get("slots", [])
            for s in slots:
                if total > 0:
                    s["percentage"] = round((s.get("votes", 0) / total) * 100, 1)
                else:
                    s["percentage"] = 0
            self.send_json(app_data)
            return

        if path.endswith("/api/slots") or path == "/api/slots":
            app_data = load_data()
            self.send_json(app_data.get("slots", []))
            return

        if path.endswith("/api/stream") or path == "/api/stream":
            app_data = load_data()
            self.send_json(app_data.get("stream_status", {}))
            return

        self.send_json({"error": "Endpoint not found"}, status=404)

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self.read_json_body()
        client_ip = self.get_client_ip()

        # Vote
        if path.endswith("/api/vote") or path == "/api/vote":
            app_data = load_data()
            slot_id = body.get("slot_id")
            voter_id = body.get("voter_id") or client_ip

            voting_status = app_data.get("voting_status", {})
            if not voting_status.get("is_open", True):
                self.send_json({"success": False, "error": "Voting is currently paused by Mashmanos."}, status=400)
                return

            voters = voting_status.setdefault("voters", {})
            if voter_id in voters:
                self.send_json({"success": False, "error": "You have already voted! Only 1 vote per viewer is allowed."}, status=400)
                return

            slots = app_data.get("slots", [])
            target_slot = None
            for s in slots:
                if s["id"] == slot_id:
                    target_slot = s
                    break

            if not target_slot:
                self.send_json({"success": False, "error": "Selected slot was not found."}, status=404)
                return

            target_slot["votes"] = target_slot.get("votes", 0) + 1
            voting_status["total_votes"] = voting_status.get("total_votes", 0) + 1
            voters[voter_id] = {
                "ip": client_ip,
                "slot_id": slot_id,
                "time": datetime.utcnow().isoformat()
            }
            save_data(app_data)
            self.send_json({
                "success": True,
                "message": f"Successfully voted for {target_slot['name']}!",
                "slot": target_slot,
                "total_votes": voting_status["total_votes"]
            })
            return

        # Login
        if path.endswith("/api/login") or path == "/api/login":
            password = body.get("password", "")
            if password == ADMIN_PASSWORD:
                self.send_json({"success": True, "token": ADMIN_TOKEN})
            else:
                self.send_json({"success": False, "error": "Invalid admin password."}, status=401)
            return

        # Admin Auth Check
        auth_header = self.headers.get("Authorization", "")
        if not self.is_admin(auth_header):
            self.send_json({"success": False, "error": "Unauthorized admin access."}, status=401)
            return

        app_data = load_data()
        if path.endswith("/api/admin/toggle-voting"):
            vs = app_data.setdefault("voting_status", {})
            vs["is_open"] = not vs.get("is_open", True)
            save_data(app_data)
            self.send_json({"success": True, "is_open": vs["is_open"]})
            return

        if path.endswith("/api/admin/reset-votes"):
            vs = app_data.setdefault("voting_status", {})
            vs["total_votes"] = 0
            vs["voters"] = {}
            for s in app_data.get("slots", []):
                s["votes"] = 0
            save_data(app_data)
            self.send_json({"success": True, "message": "All slot votes have been reset."})
            return

        self.send_json({"error": "Admin endpoint not found"}, status=404)
