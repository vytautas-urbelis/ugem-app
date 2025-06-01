import random
import hashlib

import utils.nickname_generator.adjectives as adjectives
import utils.nickname_generator.nouns as nouns
# from customer_user_profile.models import CustomerUserProfile

# Load adjectives and nouns from files
adj = adjectives.adj_list
nou = nouns.noun_list


def generate_unique_nickname(CustomerUserProfile, user_id=None):
    """
    Generates a unique nickname using a combination of an adjective, a noun, and a hash of the user_id.
    """
    if user_id is None:
        user_id = random.randint(1000, 9999)

    random.seed(hash(user_id))  # Seed randomness with user_id for uniqueness
    nickname = ''
    generate_nickname = False
    while not generate_nickname:
        adjective = random.choice(adj)
        noun = random.choice(nou)
        unique_number = hashlib.md5(str(user_id).encode()).hexdigest()[:6]  # Generate unique short hash
        nickname = f"{adjective}{noun}{unique_number}"
        if not CustomerUserProfile.objects.filter(nickname=nickname).exists():
            generate_nickname = True
    return nickname


# print(generate_unique_nickname())
