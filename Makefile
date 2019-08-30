IMAGE=robconery/velzy

serve:
	supervisor -w lib,routes,views app.js

image:
	docker build -t $(IMAGE) .

push:
	docker push $(IMAGE)
