import os
import sys
import threading

import speedtest
from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)
# A secret key is needed for sessions to work
app.secret_key = os.urandom(24)

# Global variables to store test results
test_results = {}
test_in_progress = False


def convert_to_mbps(speed_bits):
    """Converts speed from bits per second to megabits per second (Mbps)."""
    return round(speed_bits / 1_000_000, 2)


def run_test_in_background():
    """Runs the speed test and stores results."""
    global test_in_progress, test_results
    test_in_progress = True
    test_results = None
    try:
        print("Starting background speed test...")
        st = speedtest.Speedtest(secure=True)
        st.get_best_server()
        download_speed_bits = st.download()
        upload_speed_bits = st.upload()
        ping_result = round(st.results.ping, 2)

        test_results = {
            "download_mbps": convert_to_mbps(download_speed_bits),
            "upload_mbps": convert_to_mbps(upload_speed_bits),
            "ping_ms": ping_result,
        }
        print("Speed test finished successfully.")
    except Exception as e:
        print(f"An error occurred during the speed test: {e}", file=sys.stderr)
        test_results = {"error": str(e)}
    finally:
        test_in_progress = False


@app.route('/')
def index():
    """Homepage with a button to start the test."""
    return render_template('index.html')


@app.route('/start-test', methods=['POST'])
def start_test():
    """Starts the speed test in a background thread."""
    global test_in_progress
    if not test_in_progress:
        thread = threading.Thread(target=run_test_in_background)
        thread.start()

    return redirect(url_for('show_results'))


@app.route('/results')
def show_results():
    """Displays test results once they are available."""
    global test_in_progress, test_results
    if test_in_progress:
        return render_template('results.html', in_progress=True)

    return render_template('results.html', results=test_results, in_progress=False)


if __name__ == '__main__':
    app.run(debug=True)
