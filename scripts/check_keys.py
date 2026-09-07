import urllib.request, urllib.error, json, socket

orig_getaddrinfo = socket.getaddrinfo
def getaddrinfo_v4(host, port, family=0, type=0, proto=0, flags=0):
    return orig_getaddrinfo(host, port, socket.AF_INET, type, proto, flags)
socket.getaddrinfo = getaddrinfo_v4

url = 'https://api.cartesia.ai/tts/bytes'
for key in ['sk_car_skPcx4Nc8ceyEa4Nn2kpQP', 'sk_car_gpgmt5fTKpYuy7cww1rRPD']:
    headers = {
        'X-API-Key': key,
        'Cartesia-Version': '2024-06-10',
        'Content-Type': 'application/json'
    }
    voice_id = '459e168a-b63f-43e3-a835-dcc2f7d7b13e' if 'skPcx4Nc' in key else '8e95b430-ecc3-49ab-b943-8313287c1c59'
    data = {
        'model_id': 'sonic-3.6',
        'transcript': 'hi',
        'voice': { 'mode': 'id', 'id': voice_id },
        'output_format': { 'container': 'mp3', 'bit_rate': 192000, 'sample_rate': 44100 },
        'language': 'te'
    }
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as res:
            print('Key', key[:15], 'SUCCESS:', len(res.read()), 'bytes')
    except urllib.error.HTTPError as e:
        print('Key', key[:15], 'HTTPError:', e.code, e.read().decode('utf-8', errors='ignore'))
    except Exception as e:
        print('Key', key[:15], 'Error:', e)
