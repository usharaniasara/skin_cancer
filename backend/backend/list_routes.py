import app
for rule in app.app.url_map.iter_rules():
    print(f"{rule.endpoint}: {rule.methods} {rule.rule}")
