from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import time

app = Flask(__name__)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://admin:password@db:5432/pagination_demo'
db = SQLAlchemy(app)

# Model
class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)

@app.before_first_request
def setup():
    db.create_all()
    # Inserting sample data
    if not Item.query.first():
        for i in range(5000):
            item = Item(name=f"Item {i}")
            db.session.add(item)
        db.session.commit()

@app.route('/items-all', methods=['GET'])
def get_all_items():
    start_time = time.time()
    items = Item.query.all()
    duration = time.time() - start_time
    return jsonify({
        'items': [{'id': item.id, 'name': item.name} for item in items],
        'response_time': duration
    })

@app.route('/items', methods=['GET'])
def get_items():
    start_time = time.time()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    items = Item.query.paginate(page=page, per_page=per_page, error_out=False)

    duration = time.time() - start_time
    return jsonify({
        'items': [{'id': item.id, 'name': item.name} for item in items.items],
        'total': items.total,
        'page': items.page,
        'per_page': items.per_page,
        'response_time': duration
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
