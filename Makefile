serve:
	supervisor -w lib,routes,views app.js

image:
	docker build -t robconery/velzy .
