# TheWheelOfJeopardy
Foundations of Software Engineering - The Wheel Of Jeopardy

## Dockerfile instructions
Build Docker image:
```docker build --tag {sometag} . ```

Running docker image:
```docker run -it -p 5002:5002 -d --name wheel {sometag}```