from flask import Flask
from routes.item_routes import bp as item_bp
from routes.monster_routes import bp as monster_bp
from routes.skill_routes import bp as skill_bp
from routes.abnormal_routes import bp as abnormal_bp
from routes.merchant_routes import bp as merchant_bp
from routes.chest_routes import bp as chest_bp
from routes.quest_routes import bp as quest_bp
from routes.craft_routes import bp as craft_bp
from routes.skill_tree_routes import bp as skill_tree_bp
from routes.doll_routes import bp as doll_bp
from routes.servant_routes import bp as servant_bp


__all__ = ['register_routes']

def register_routes(app: Flask):
    """Register all blueprint routes"""
    app.register_blueprint(item_bp)
    app.register_blueprint(monster_bp)
    app.register_blueprint(skill_bp)
    app.register_blueprint(abnormal_bp)
    app.register_blueprint(merchant_bp)
    app.register_blueprint(chest_bp)
    app.register_blueprint(quest_bp)
    app.register_blueprint(craft_bp)
    app.register_blueprint(skill_tree_bp)
    app.register_blueprint(doll_bp)
    app.register_blueprint(servant_bp)