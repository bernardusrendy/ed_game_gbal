from flask import Blueprint, send_from_directory, render_template, flash, request, redirect, url_for, render_template
import os
from threading import Timer

class RepeatingTimer(object):
	"""
	USAGE:
	from time import sleep
	r = RepeatingTimer(_print, 0.5, "hello")
	r.start(); sleep(2); r.interval = 0.05; sleep(2); r.stop()
	"""

	def __init__(self, function, interval, *args, **kwargs):
		super(RepeatingTimer, self).__init__()
		self.args = args
		self.kwargs = kwargs
		self.function = function
		self.interval = interval

	def start(self):
		self.callback()
		
	def stop(self):
		self.interval = False
		
	def callback(self):
		if self.interval:
			self.function(*self.args, **self.kwargs)
			Timer(self.interval, self.callback, ).start()

value= 10
def valueIncrease(value):
	value=value+1
	print(value)
main = Blueprint('main', __name__)
timer=threading.Timer(1.0, valueIncrease(value)) 
timer.start()
@main.route('/')

def index():
    return render_template('index.html',value = value)
