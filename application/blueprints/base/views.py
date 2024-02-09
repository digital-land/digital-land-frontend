from flask import Blueprint, render_template, abort
import os

base = Blueprint("base", __name__, template_folder='./application/templates/')

@base.route("/")
def index():
    return render_template("index.html")

#render component template files
@base.route('/component/<template_name>')
def show_template(template_name):
    # Check if the template file exists
    template_path = os.path.join(base.template_folder, f"component/{template_name}.html")
    print(template_path)
    print(os.path.isfile(template_path))
    if os.path.isfile(template_path):
        # Render the template if it exists
        return render_template(f"component/{template_name}.html")
    else:
        # Return a 404 error if the template does not exist
        abort(404)
