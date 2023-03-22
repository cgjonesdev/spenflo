import bcrypt

def convert_data(obj, data, direction='to_json'):
    value_map = {
        True: 'true',
        False: 'false',
        None: 'null'}
    reverse_value_map = {v: k for k, v in value_map.items()}

    def process(data):
        for k, v in data.items():
            if direction == 'to_json':
                if isinstance(v, (bool, type(None))):
                    data[k] = value_map[v]
            elif direction == 'to_dict':
                if v in reverse_value_map:
                    data[k] = reverse_value_map[v]
        return data

    if isinstance(data, list):
        for i, _obj in enumerate(data):
            data[i] = process(_obj)
    elif isinstance(data, dict):
        data = process(data)

    return data

def process_pw_hash(pw=None, _hash=None):
    if pw and not _hash:
        return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()
    if pw and _hash:
        return bcrypt.checkpw(pw.encode(), _hash.encode())
