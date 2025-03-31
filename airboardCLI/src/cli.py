import ldclient
from ldclient.config import Config
from ldclient.context import Context
import os, sys
import requests
import random
import datetime


def printParams():
    if debug:
        print("\033[94mscript executed...\033[0m")
        print("\033[94mLD_USER: ", os.environ['LD_USER'], "\033[0m")
        print("\033[94mLAUNCHDARKLY_SDK_KEY: ", os.environ['LAUNCHDARKLY_SDK_KEY'], "\033[0m")
        print("\033[94mLD_LOCATION: ", os.environ['LD_LOCATION'], "\033[0m")

# Function to create a LaunchDarkly context
def createLDContext(user):
    # Create a context for the user
    user_context = Context.builder(f'{user}-cli-key').kind('user').name(f'{user}-cli-user').build()
    location_context = Context.builder('office-key').kind('location').name(f'{location}').build()
    multi_context = Context.create_multi(user_context, location_context)
    
    return multi_context

def check_feature_flag(user, flag_key):
    if not ldclient.get():
        print("\033[91mLaunchDarkly client is not initialized.\033[0m")
        return False
    
    context = createLDContext(user)
    client = ldclient.get()

    flag_value = client.variation(flag_key, context, False)  # Default to False if flag isn't found
    if debug:
        print(f"\033[94mFeature flag '{flag_key}' for user '{user}': {flag_value}\033[0m")
    return flag_value


def update_server():
    print(f'Updating the server with content from my location {location}...')
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


if __name__ == "__main__":

    ## Set the debug mode based on the environment variable
    try:
        if os.environ['LD_DEBUG'].lower() == "true":
            debug = True
        else:
            debug = False
    except KeyError:
        debug = False
    

    ## Set the environment variables for LaunchDarkly user, SDK key, and location
    try:
        user = os.environ['LD_USER']
    except KeyError:
        print("Please set the LD_USER environment variable.")
        sys.exit(1)
    
    try:
        sdk_key = os.environ['LAUNCHDARKLY_SDK_KEY']
    except KeyError:
        print("Please set the LAUNCHDARKLY_SDK_KEY environment variable.")
        sys.exit(1)
    
    try:
        location = os.environ['LD_LOCATION']
    except KeyError:
        print("Please set the LD_USER, LAUNCHDARKLY_SDK_KEY, and LD_LOCATION environment variables.")
        sys.exit(1)

    # Print some debug of the application parameters
    printParams()
    
    ## For this example, we are setting the update_flag_key to the feature flag key that allows database population.
    ## If false, the script will not populate the database.
    update_flag_key = "allow_db_populate"  
    cli_allowed_key = "cli_allowed"  
    

    # Initialize LaunchDarkly client
    ldclient.set_config(Config(sdk_key))


    #############################
    ##### Location checking #####
    #############################
    
    ## We now check if the user is allowed to update to use the CLI from this location based on the feature flag value.
    cli_allowed = check_feature_flag(user, cli_allowed_key)
    if not cli_allowed:
        print(f"\033[91mUser {user} is not allowed to run the CLI from {location}.\033[0m")
        sys.exit(0)
    else:
        print(f"\033[92mUser {user} is running from an approved location ({location}).\033[0m")


    #############################
    #####   User checking   #####
    #############################

    ## We now check if the user is allowed to update the database based on the feature flag value.
    update_allowed = check_feature_flag(user, update_flag_key)
    
    if not update_allowed:
        print(f"\033[91mUser {user} is not allowed to update the database.\033[0m")
        sys.exit(0)
    else:
        print(f"\033[92mUser {user} is allowed to update the database.\033[0m")
        update_server()

    # Close the LaunchDarkly client before exiting
    print("Closing LaunchDarkly client...")
    ldclient.get().close()