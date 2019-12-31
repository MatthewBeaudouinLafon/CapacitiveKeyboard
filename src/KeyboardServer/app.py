from threading import Lock
from flask import Flask, render_template
from flask_socketio import SocketIO, Namespace, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
thread = None
thread_lock = Lock()

@app.route('/')
def index():
    return render_template('index.html', async_mode=socketio.async_mode)

def background_thread():
    while True:
        k_input = input("keyboard input: ")
        socketio.emit('keyboard_input',
                      {'data': k_input},
                      namespace='/test')
        # unblock for sockets to do their magic
        socketio.sleep(0.1)

@socketio.on('connect', namespace='/test')
def on_connect():
    global thread
    with thread_lock:
        if thread is None:
            print("starting background thread")
            thread = socketio.start_background_task(background_thread)
    print("connected!")

@socketio.on('disconnect', namespace='/test')
def on_disconnect():
        print("disconnected :(")


if __name__ == '__main__':
    # keypress = input("keyboard input: ")
    socketio.run(app)
