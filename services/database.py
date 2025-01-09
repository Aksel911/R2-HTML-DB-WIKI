import pyodbc
from contextlib import contextmanager
from flask import current_app

@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    conn_str = ';'.join(f'{k}={v}' for k, v in current_app.config['DATABASE_CONFIG'].items())
    conn = pyodbc.connect(conn_str)
    try:
        yield conn
    finally:
        conn.close()

def execute_query(query: str, params=None, fetch_one=False):
    """Execute a database query and return results"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            
            # Определяем тип запроса
            query_type = query.strip().upper().split()[0]
            
            # Для SELECT запросов возвращаем результаты

            #print(query_type)
            if query_type == 'SELECT' or query_type == 'WITH':
                if fetch_one:
                    return cursor.fetchone()
                return cursor.fetchall()
            # Для остальных запросов (INSERT/UPDATE/DELETE) делаем commit и проверяем успешность
            else:
                conn.commit()
                # После INSERT/UPDATE/DELETE проверяем количество затронутых строк
                affected_rows = cursor.rowcount
                if affected_rows >= 0:  # Если операция успешна
                    return True
                return False

        except Exception as e:
            conn.rollback()
            print(f"Database error: {str(e)}")
            print(f"Query: {query}")
            print(f"Params: {params}")
            raise
        
        
