from jinja2 import Environment, FileSystemLoader
import os
import shutil

template_dir = os.path.join(os.path.dirname(__file__), 'templates')
env = Environment(loader = FileSystemLoader(template_dir))

output_dir = 'dist'
os.makedirs(output_dir, exist_ok=True)

static_src_dir = os.path.join(os.path.dirname(__file__), 'static')
static_dest_dir = os.path.join(output_dir, 'static')

if os.path.exists(static_dest_dir):
    shutil.rmtree(static_dest_dir) # Remove existing static folder to ensure clean copy

shutil.copytree(static_src_dir, static_dest_dir)

# Get the template object for 'index.html'
index_template = env.get_template('index.html')
# Render the template. No dynamic data being passed yet, as per your request.
rendered_index_html = index_template.render()
# Define the output file path for index.html
index_output_path = os.path.join(output_dir, 'index.html')
# Save the rendered HTML to the file
with open(index_output_path, 'w', encoding='utf-8') as f:
    f.write(rendered_index_html)
print(f"Generated: {index_output_path}")


about_template = env.get_template('about.html')
rendered_about_html = about_template.render() 
about_output_path = os.path.join(output_dir, 'about.html')
with open(about_output_path, 'w', encoding='utf-8') as f:
    f.write(rendered_about_html)
print(f"Generated: {about_output_path}")


projects_template = env.get_template('projects.html')
rendered_projects_html = projects_template.render() 
projects_output_path = os.path.join(output_dir, 'projects.html')
with open(projects_output_path, 'w', encoding='utf-8') as f:
    f.write(rendered_projects_html)
print(f"Generated: {projects_output_path}")