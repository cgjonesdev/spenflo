from functools import wraps
from flask import request, redirect, render_template, url_for, session

def login_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        session['referrer'] = request.endpoint
        if session.get('logged_in') and args[0].context.get('user_id'):
            return func(*args, **kwargs)
        return redirect('/login')
    return decorated
