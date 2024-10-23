import os
from flask import Flask, request, jsonify
from openai import OpenAI
from flask_cors import CORS
from pathlib import Path
from werkzeug.utils import secure_filename
import sys

app = Flask(__name__)
CORS(app)


UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
current_path = os.path.abspath(os.path.dirname(__file__))

apiKey = sys.argv[1]

client = OpenAI( 
  api_key = apiKey,
  base_url = "https://api.moonshot.cn/v1"
)

tools = [
  {
    "type": "function",
    "function": {
      "name": "CodeRunner",
      "description": "代码执行器，支持运行 python 和 javascript 代码",
      "parameters": {
        "type": "object",
        "properties": {
          "language": {
            "description": "代码语言，支持 python 和 javascript",
            "type": "string"
          },
          "code": {
              "type": "string",
              "description": "代码写在这里"
            }
        }
      }
    },
  }
]

def chating(history):
  response = client.chat.completions.create(
    model='moonshot-v1-8k',
    messages=history,
    temperature=0.3,
    tools=tools
  )

  content = response.choices[0].message.content
  return content

@app.route('/api/v1/chat/chat', methods=['POST'])
def chat():
  data = request.json
  id = data['id']
  history = data['history']
  
  return {
    "id": id,
    "content": chating(history)
  }
  
@app.route('/api/v1/file/upload', methods=['POST'])
def upload():
  files = request.files
  file = files['file']

  filename = secure_filename(file.filename)

  if not os.path.exists(os.path.join(current_path, app.config['UPLOAD_FOLDER'])):
    os.makedirs(os.path.join(current_path, app.config['UPLOAD_FOLDER']))

  path = os.path.join(current_path, app.config['UPLOAD_FOLDER'], filename)
  file.save(path)


  file_object = client.files.create(file=Path(path), purpose="file-extract")
  os.remove(path)

  return { 
    "fileId": file_object.id
  }

@app.route('/api/v1/file/list', methods=['GET'])
def list():
  file_list = client.files.list()
  print(file_list.data)

  fileList = []
  for file in file_list.data:
    fileList.append({
      "id": file.id,
      "name": file.filename,
      "createTime": file.created_at,
      "size": file.bytes
    })
  return {
    "files": fileList
  }

@app.route('/api/v1/file/delete', methods=['POST'])
def delete():
  data = request.json
  file_id = data['fileId']

  client.files.delete(file_id=file_id)

  return {
    "status": "success"
  }
  
@app.route('/api/v1/file/chat', methods=['POST'])
def file_chat():
  data = request.json
  id = data['id']
  history = data['history']
  file_ids = data['fileIds']

  file_contents = []

  for file_id in file_ids:
    file_content = client.files.content(file_id=file_id).text
    file_contents.append(file_content)
    history.insert(len(history) - 2, {
      "role": "system",
      "content": file_content
    })


  return {
    "id": id,
    "fileContents": file_contents,
    "content": chating(history)
  }


if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000, debug=True)