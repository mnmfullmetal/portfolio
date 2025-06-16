from jinja2 import Environment, FileSystemLoader
import os

template_dir = os.path.join(os.path.dirname(__file__), 'templates')
env = Environment(loader = FileSystemLoader(template_dir))

