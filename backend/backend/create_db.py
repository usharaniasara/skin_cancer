import pymysql

try:
    # Connect without specifying a database
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='@Harika2711', # Using the real password here for the script execution
    )
    
    with connection.cursor() as cursor:
        cursor.execute("CREATE DATABASE IF NOT EXISTS skynex_db;")
        print("✅ Database 'skynex_db' created successfully or already exists.")
        
    connection.close()
except Exception as e:
    print(f"❌ Error creating database: {e}")
