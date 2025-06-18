from jinja2 import Environment, FileSystemLoader
import os
import shutil
import data
from livereload import Server  

def build():
    print("Building static files...")
    
    # Define directories
    template_dir = os.path.join(os.path.dirname(__file__), 'templates')
    output_dir = 'dist'
    static_src_dir = os.path.join(os.path.dirname(__file__), 'static')
    static_dest_dir = os.path.join(output_dir, 'static')
    
    # Set up Jinja2 environment
    env = Environment(loader=FileSystemLoader(template_dir))
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Copy static files by removing the old and copying the new
    if os.path.exists(static_dest_dir):
        shutil.rmtree(static_dest_dir)
    shutil.copytree(static_src_dir, static_dest_dir)
    
    # Render templates
    for template_filename in os.listdir(template_dir):
        if template_filename.endswith('.html'):
            page_name = os.path.splitext(template_filename)[0]
            template = env.get_template(template_filename)
            
            # Prepare context data
            context_data = {"current_page": page_name}
            if page_name == 'index':
                context_data['projects'] = data.PROJECTS
            
            # Render and write file
            rendered_html = template.render(**context_data)
            output_file_path = os.path.join(output_dir, template_filename)
            with open(output_file_path, 'w', encoding='utf-8') as f:
                f.write(rendered_html)
                
    print("Build complete.")

if __name__ == "__main__":

    build()

    server = Server()
    
    # Add watchers to run the build() function on file changes
    server.watch('templates/', build)
    server.watch('static/', build)
    server.watch('data.py', build)
    
    print("Starting development server at http://localhost:5500")
    server.serve(root='dist', port=5500, host='localhost')