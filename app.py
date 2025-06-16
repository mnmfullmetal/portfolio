from jinja2 import Environment, FileSystemLoader
import os
import shutil
import data

template_dir = os.path.join(os.path.dirname(__file__), 'templates')
env = Environment(loader = FileSystemLoader(template_dir))

output_dir = 'dist'
os.makedirs(output_dir, exist_ok=True)

static_src_dir = os.path.join(os.path.dirname(__file__), 'static')
static_dest_dir = os.path.join(output_dir, 'static')

if os.path.exists(static_dest_dir):
    shutil.rmtree(static_dest_dir)

shutil.copytree(static_src_dir, static_dest_dir)

for template_filename in os.listdir(template_dir):
    if template_filename.endswith('.html'):
        page_name = os.path.splitext(template_filename)[0]
        template = env.get_template(template_filename)

        context_data = {"current_page": page_name}

        if page_name == 'projects':
            context_data['projects'] = data.PROJECTS

        rendered_html = template.render(**context_data)

        output_file_path = os.path.join(output_dir, template_filename)
        with open(output_file_path, 'w', encoding='utf-8') as f:
            f.write(rendered_html)
        print(f"Generated: {output_file_path}")