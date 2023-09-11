from flask import Flask, render_template, request, jsonify, send_file, after_this_request
from upload import upload_to_bucket, list_bucket_contents, delete_from_bucket, download_from_bucket
import os

app = Flask(__name__, template_folder='templates')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if request.method == 'POST':
        try:
          file = request.files['file']
          file_name = file.filename
          file_path = f'./{file_name}'
          file.save(file_path)
          endpoint_url = 'https://gateway.storjshare.io'
          upload_response = upload_to_bucket(file_path, file_name, endpoint_url)
          os.remove(file_path)
          # actually upload it
          # Process the file upload and return a success JSON response
          return upload_response
        except Exception as e:
          # Return a JSON response with the error message
          return jsonify({"success": False, "error": str(e)})

@app.route('/list', methods=['POST'])
def list_files():
    if request.method == 'POST':
        try:
          endpoint_url = 'https://gateway.storjshare.io'
        
          return list_bucket_contents(endpoint_url)
        except Exception as e:
          # Return a JSON response with the error message
          return jsonify({"success": False, "error": str(e)})

@app.route('/delete', methods=['POST'])
def delete_file():
    if request.method == 'POST':
      data = request.get_json()
      file_name = data.get('file')
      endpoint_url = 'https://gateway.storjshare.io'
      print(file_name)  
      try:
        return delete_from_bucket(file_name, endpoint_url)
      except Exception as e:
        # Return a JSON response with the error message
        return jsonify({"success": False, "error": str(e)})

@app.route('/download', methods=['POST','GET'])
def download_file():
    if request.method == 'POST':
      data = request.get_json()
      file_name = data.get('file')
      endpoint_url = 'https://gateway.storjshare.io'
      try:
        file_path = download_from_bucket(file_name, endpoint_url)
        @after_this_request
        def remove_file(response):
            try:
                os.remove(file_path)
            except Exception as error:
                app.logger.error("Error removing file: %s", str(error))
            return response
        return send_file(file_path, as_attachment=True)
      except Exception as e:
        # Return a JSON response with the error message
        return jsonify({"success": False, "error": str(e)})

app.run(host='0.0.0.0', port=81, debug=True, use_reloader=False)

