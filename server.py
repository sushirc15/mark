#!/usr/bin/env python3
"""
Mashmanos Casino Portal - Backend Server
Provides clean URL SPA routing, REST API for slot voting, live stream status,
leaderboards, bonus hunt archives, and password-protected admin dashboard.
Zero external dependencies, running on Python 3 standard library.
"""

import http.server
import socketserver
import json
import os
import sys
import mimetypes
import urllib.parse
from datetime import datetime

PORT = int(os.environ.get("PORT", 3000))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
DATA_FILE = os.path.join(BASE_DIR, "data.json")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "mash123")
ADMIN_TOKEN = "mash_auth_" + os.urandom(8).hex()

# Ensure public dir exists
os.makedirs(PUBLIC_DIR, exist_ok=True)

def load_data():
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading {DATA_FILE}: {e}")
        return {}

def save_data(data):
    try:
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving {DATA_FILE}: {e}")
        return False

# Initialize data
app_data = load_data()

class MashmanosHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and caching headers
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
        return self.client_address[0]

    def read_json_body(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length <= 0:
                return {}
            raw_data = self.rfile.read(content_length).decode("utf-8")
            return json.loads(raw_data)
        except Exception as e:
            print(f"JSON parse error: {e}")
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

        # API Endpoints
        if path == "/api/state":
            global app_data
            app_data = load_data()
            # Calculate percentages for slots
            total = app_data.get("voting_status", {}).get("total_votes", 0)
            slots = app_data.get("slots", [])
            for s in slots:
                if total > 0:
                    s["percentage"] = round((s.get("votes", 0) / total) * 100, 1)
                else:
                    s["percentage"] = 0
            self.send_json(app_data)
            return

        if path == "/api/slots":
            app_data = load_data()
            self.send_json(app_data.get("slots", []))
            return

        if path == "/api/stream":
            app_data = load_data()
            self.send_json(app_data.get("stream_status", {}))
            return

        # Serve static files from public directory
        # If path starts with /mark_jackpot_loop.gif, check root or public
        if path == "/mark_jackpot_loop.gif":
            gif_path = os.path.join(PUBLIC_DIR, "mark_jackpot_loop.gif")
            if not os.path.exists(gif_path):
                gif_path = os.path.join(BASE_DIR, "mark_jackpot_loop.gif")
            if os.path.exists(gif_path):
                self.serve_file(gif_path, "image/gif")
                return

        # Check in public folder
        rel_path = path.lstrip("/")
        if not rel_path:
            rel_path = "index.html"
        
        target_file = os.path.join(PUBLIC_DIR, rel_path)
        
        if os.path.isfile(target_file):
            mime_type, _ = mimetypes.guess_type(target_file)
            if not mime_type:
                mime_type = "application/octet-stream"
            self.serve_file(target_file, mime_type)
            return

        # Clean URL SPA routing: if requesting an HTML page or route like /leaderboard, /stream, etc.
        # Fallback to public/index.html
        index_file = os.path.join(PUBLIC_DIR, "index.html")
        if os.path.isfile(index_file):
            self.serve_file(index_file, "text/html; charset=utf-8")
            return

        self.send_error(404, f"File Not Found: {path}")

    def serve_file(self, file_path, content_type):
        try:
            with open(file_path, "rb") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_error(500, f"Error reading file: {e}")

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self.read_json_body()
        client_ip = self.get_client_ip()
        global app_data

        # --- USER ACTIONS ---
        if path == "/api/vote":
            app_data = load_data()
            slot_id = body.get("slot_id")
            voter_id = body.get("voter_id") or client_ip

            # Check if voting is open
            voting_status = app_data.get("voting_status", {})
            if not voting_status.get("is_open", True):
                self.send_json({"success": False, "error": "Voting is currently paused by Mashmanos."}, status=400)
                return

            voters = voting_status.setdefault("voters", {})
            if voter_id in voters or client_ip in voters:
                self.send_json({"success": False, "error": "You have already voted in this round! Only 1 vote per viewer is allowed."}, status=400)
                return

            # Find slot
            slots = app_data.get("slots", [])
            target_slot = None
            for s in slots:
                if s["id"] == slot_id:
                    target_slot = s
                    break

            if not target_slot:
                self.send_json({"success": False, "error": "Selected slot was not found."}, status=404)
                return

            # Register vote
            target_slot["votes"] = target_slot.get("votes", 0) + 1
            voting_status["total_votes"] = voting_status.get("total_votes", 0) + 1
            voters[voter_id] = {
                "ip": client_ip,
                "slot_id": slot_id,
                "time": datetime.utcnow().isoformat()
            }
            if voter_id != client_ip:
                voters[client_ip] = voters[voter_id]

            save_data(app_data)
            self.send_json({
                "success": True,
                "message": f"Successfully voted for {target_slot['name']}!",
                "slot": target_slot,
                "total_votes": voting_status["total_votes"]
            })
            return

        # --- ADMIN AUTH ---
        if path == "/api/admin/auth":
            password = body.get("password", "")
            if password == ADMIN_PASSWORD:
                self.send_json({
                    "success": True,
                    "token": ADMIN_TOKEN,
                    "message": "Authenticated successfully as Mashmanos Admin."
                })
            else:
                self.send_json({"success": False, "error": "Incorrect password. Access denied."}, status=401)
            return

        # --- PROTECTED ADMIN ENDPOINTS ---
        auth_header = self.headers.get("Authorization", "")
        if not self.is_admin(auth_header) and body.get("auth_token") != ADMIN_TOKEN and body.get("password") != ADMIN_PASSWORD:
            self.send_json({"success": False, "error": "Unauthorized. Please log in with admin password."}, status=401)
            return

        app_data = load_data()

        # Slot Management
        if path == "/api/admin/slots":
            action = body.get("action")
            slots = app_data.get("slots", [])
            voting_status = app_data.get("voting_status", {})

            if action == "reset_all":
                for s in slots:
                    s["votes"] = 0
                voting_status["total_votes"] = 0
                voting_status["voters"] = {}
                save_data(app_data)
                self.send_json({"success": True, "message": "All slot votes reset successfully.", "slots": slots})
                return

            elif action == "reset_one":
                slot_id = body.get("slot_id")
                for s in slots:
                    if s["id"] == slot_id:
                        old_votes = s.get("votes", 0)
                        s["votes"] = 0
                        voting_status["total_votes"] = max(0, voting_status.get("total_votes", 0) - old_votes)
                        # Remove voters who voted for this slot
                        voting_status["voters"] = {k: v for k, v in voting_status.get("voters", {}).items() if v.get("slot_id") != slot_id}
                        break
                save_data(app_data)
                self.send_json({"success": True, "message": "Slot vote count reset.", "slots": slots})
                return

            elif action == "toggle_voting":
                new_state = not voting_status.get("is_open", True)
                if "is_open" in body:
                    new_state = bool(body["is_open"])
                voting_status["is_open"] = new_state
                save_data(app_data)
                self.send_json({"success": True, "is_open": new_state, "message": f"Voting is now {'OPEN' if new_state else 'CLOSED'}."})
                return

            elif action == "add":
                new_slot = {
                    "id": body.get("id") or ("slot_" + os.urandom(4).hex()),
                    "name": body.get("name", "New Slot"),
                    "provider": body.get("provider", "Casino Provider"),
                    "image": body.get("image", "/images/gates_of_olympus.svg"),
                    "votes": int(body.get("votes", 0)),
                    "rtp": body.get("rtp", "96.50%"),
                    "max_win": body.get("max_win", "10,000x"),
                    "volatility": body.get("volatility", "High"),
                    "category": body.get("category", "Video Slot")
                }
                slots.append(new_slot)
                voting_status["total_votes"] = voting_status.get("total_votes", 0) + new_slot["votes"]
                save_data(app_data)
                self.send_json({"success": True, "message": "New slot added.", "slot": new_slot, "slots": slots})
                return

            elif action == "edit":
                slot_id = body.get("id")
                updated = None
                for s in slots:
                    if s["id"] == slot_id:
                        for k, v in body.items():
                            if k not in ["action", "auth_token", "password"]:
                                s[k] = v
                        updated = s
                        break
                save_data(app_data)
                self.send_json({"success": True, "message": "Slot updated.", "slot": updated, "slots": slots})
                return

            elif action == "delete":
                slot_id = body.get("slot_id")
                app_data["slots"] = [s for s in slots if s["id"] != slot_id]
                save_data(app_data)
                self.send_json({"success": True, "message": "Slot removed.", "slots": app_data["slots"]})
                return

        # Stream Status Management
        if path == "/api/admin/stream":
            stream = app_data.get("stream_status", {})
            if "is_live" in body:
                stream["is_live"] = bool(body["is_live"])
            if "title" in body:
                stream["title"] = body["title"]
            if "viewers" in body:
                stream["viewers"] = int(body["viewers"])
            if "channel" in body:
                stream["channel"] = body["channel"]
            if "next_stream" in body:
                stream["next_stream"] = body["next_stream"]
            save_data(app_data)
            self.send_json({"success": True, "message": "Stream status updated.", "stream_status": stream})
            return

        # Leaderboard Management
        if path == "/api/admin/leaderboard":
            sponsor = body.get("sponsor", "shuffle")
            lb = app_data.get("leaderboards", {}).get(sponsor)
            if lb and "entries" in body:
                lb["entries"] = body["entries"]
            if lb and "prize_pool" in body:
                lb["prize_pool"] = body["prize_pool"]
            if lb and "ends_in_days" in body:
                lb["ends_in_days"] = int(body["ends_in_days"])
            save_data(app_data)
            self.send_json({"success": True, "message": "Leaderboard updated.", "leaderboard": lb})
            return

        # Bonus Hunts Management
        if path == "/api/admin/bonushunts":
            action = body.get("action", "add")
            hunts = app_data.get("bonus_hunts", [])
            if action == "add":
                new_hunt = {
                    "id": len(hunts) + 1,
                    "date": body.get("date", datetime.utcnow().strftime("%Y-%m-%d")),
                    "title": body.get("title", f"Stream #{len(hunts)+1}: Bonus Hunt"),
                    "start_cost": float(body.get("start_cost", 2000)),
                    "total_win": float(body.get("total_win", 2500)),
                    "multiplier": round(float(body.get("total_win", 2500)) / max(1, float(body.get("start_cost", 2000))), 2),
                    "bonuses_opened": int(body.get("bonuses_opened", 20)),
                    "best_win": body.get("best_win", "Gates of Olympus — $1,500 (300x)"),
                    "status": "PROFIT" if float(body.get("total_win", 2500)) >= float(body.get("start_cost", 2000)) else "BUST",
                    "vod_url": body.get("vod_url", "https://kick.com/mashmanos")
                }
                hunts.insert(0, new_hunt)
                save_data(app_data)
                self.send_json({"success": True, "message": "Bonus hunt added.", "bonus_hunts": hunts})
                return
            elif action == "delete":
                hunt_id = body.get("hunt_id")
                app_data["bonus_hunts"] = [h for h in hunts if h["id"] != hunt_id]
                save_data(app_data)
                self.send_json({"success": True, "message": "Bonus hunt deleted.", "bonus_hunts": app_data["bonus_hunts"]})
                return

        self.send_error(404, "Endpoint not found.")

def run_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), MashmanosHTTPHandler) as httpd:
        print(f"🎰 Mashmanos Portal Server running on http://localhost:{PORT}")
        print(f"🔑 Admin default password: {ADMIN_PASSWORD}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")

if __name__ == "__main__":
    run_server()
