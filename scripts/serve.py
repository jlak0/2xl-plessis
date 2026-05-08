from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class SpaHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith("/assets/"):
            self.path = "/public" + self.path
        path = self.translate_path(self.path.split("?", 1)[0])
        if not Path(path).exists() and "." not in Path(self.path).name:
            self.path = "/index.html"
        super().do_GET()


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", 4173), SpaHandler)
    print("Serving on http://localhost:4173")
    server.serve_forever()
