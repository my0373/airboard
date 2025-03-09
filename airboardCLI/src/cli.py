import os
import ldclient
from ldclient.config import Config
from ldclient import Context
import requests
import random
import datetime

def main():
    user =  getUser()
    sdk_key = getLDSDKKey()
    multi_context = createLDContext(user)

    ldclient.set_config(Config(sdk_key))
    can_update_db = allowed_to_update(multi_context)
    print(f'The user {user} is allowed to update the database.') 

    if can_update_db:
        update_server()

def update_server():
    for i in range (1,20):

        # Define the endpoint
        url = "http://airboardserver:8080/flights/{}".format(i)
        #print("attempting to send data to:" , url)

        flight_data = generate_flight_data(i)
        response = requests.post(url, json=flight_data)
        # Print response
        print("Status Code:", response.status_code)
        #print("Response Body:", response.text)
        

def generate_flight_data(flight_number: int):
    return {
        "flight_number": flight_number,
        "airport_ICAO": random.choice(["KJFK", "KLAX", "EGLL", "EDDF", "OMDB"]),
        "airline_name": random.choice(["Delta", "United", "Lufthansa", "Emirates", "British Airways"]),
        "expected_arrival_time": (datetime.datetime.now() + datetime.timedelta(hours=random.randint(1, 12))).strftime("%Y-%m-%d %H:%M:%S"),
        "expected_departure_time": (datetime.datetime.now() + datetime.timedelta(hours=random.randint(-12, -1))).strftime("%Y-%m-%d %H:%M:%S"),
        "gate": random.randint(1, 50),
        "baggage_carousel": random.randint(1, 10),
        "delayed": random.choice([True, False]),
        "cancelled": random.choice([True, False]),
        "gate_changed": random.choice([True, False])
    }


def allowed_to_update(multi_context):
    # Only users with a name of "myork" and a location of "office" are allowed to update the database.
    allow_db_update = ldclient.get().variation(key='allow_db_populate',context=multi_context,default=False)
    
    return allow_db_update

def createLDContext(user):
    # Create a context for the user
    user_context = Context.builder(f'{user}-cli-key').kind('user').name(f'{user}-cli-user').build()
    location_context = Context.builder(f'office-key').kind('location').name('office').build()
    multi_context = Context.create_multi(user_context, location_context)
    return multi_context

    
def setupLD(sdk_key):

    if not ldclient.get().is_initialized():
        print("*** SDK failed to initialize. Please check your internet connection and SDK credential for any typo.")
        exit()
    print("*** SDK successfully initialized")

def getLDSDKKey():
    sdk_key = os.environ['LAUNCHDARKLY_SDK_KEY']

    if not sdk_key:
        print("*** Please set the LAUNCHDARKLY_SDK_KEY env first")
        exit()
    else:
        print("SDK key successfully found.")
    return sdk_key


def getUser():
    return os.environ['USER']

if __name__ == '__main__':
    main()