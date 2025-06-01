""""""

import math


def calculate_business_rating(
        followers,
        engaged_followers,
        total_likes,
        vouchers_issued,
        vouchers_used,
        unique_voucher_users,
        k=1,
        w_r=0.6,
        w_e1=0.25,
        w_e2=0.15,
        w_r1=0.4,
        w_r2=0.3,
        w_r3=0.3,
        max_r2=10  # Maximum expected average vouchers per customer
):
    # Validate weights sum to 1
    total_weight = w_r + w_e1 + w_e2
    if not abs(total_weight - 1.0) < 1e-6:
        raise ValueError("Weights w_r, w_e1, and w_e2 must sum up to 1.")

    total_r_weight = w_r1 + w_r2 + w_r3
    if not abs(total_r_weight - 1.0) < 1e-6:
        raise ValueError("Weights w_r1, w_r2, and w_r3 must sum up to 1.")

    # Prevent negative inputs
    if any(
            value < 0
            for value in [
                followers,
                engaged_followers,
                total_likes,
                vouchers_issued,
                vouchers_used,
                unique_voucher_users,
            ]
    ):
        raise ValueError("All input values must be non-negative.")

    # Voucher Redemption Rate (R1)
    R1 = vouchers_used / (vouchers_issued + k)

    # Average Vouchers per Customer (R2)
    avg_vouchers_per_customer = vouchers_used / (unique_voucher_users + k)

    # Normalize R2 using logarithmic scaling
    R2 = math.log(avg_vouchers_per_customer + 1) / math.log(max_r2 + 1)
    # R2 = min(max(R2, 0), 1)
    R2 = 1 - min(max(R2, 0), 1)

    # Unique Voucher User Ratio (R3)
    R3 = unique_voucher_users / (followers + k)
    R3 = min(max(R3, 0), 1)

    # Combined Voucher Usage Score (R)
    R = (w_r1 * R1) + (w_r2 * R2) + (w_r3 * R3)

    # Engagement Rate based on Engaged Followers (E1)
    E1 = engaged_followers / (followers + k)
    E1 = min(max(E1, 0), 1)

    # Engagement Rate from Likes (E2)
    E2 = total_likes / (followers + k)
    E2 = min(E2, 1.0)  # Cap E2 at 1

    # Calculate the overall rating
    rating = (w_r * R) + (w_e1 * E1) + (w_e2 * E2)

    # Convert to percentage
    rating_percentage = rating * 100

    return rating_percentage


# Test Cases Data (20 Tests)
# test_data = [
#     # (followers, engaged_followers, total_likes, vouchers_issued, vouchers_used, unique_voucher_users, type)
#     (10000, 1000, 27000, 12000, 8000, 3000, 'Healthy'),
#     (10000, 50, 50000, 20000, 19800, 100, "Fake"),
#     (5000, 3500, 4000, 4000, 3200, 2800, "Healthy"),
#     (1000, 10, 10000, 5000, 4950, 50, "Fake"),
#     (800, 600, 700, 600, 540, 500, "Healthy"),
#     (500, 5, 2000, 1000, 990, 10, "Fake"),
#     (300, 250, 280, 250, 225, 200, "Healthy"),
#     (200, 2, 1000, 500, 495, 5, "Fake"),
#     (150, 120, 130, 120, 110, 100, "Healthy"),
#     (5000, 20, 25000, 8000, 7920, 40, "Fake"),
#     (2000, 1500, 1600, 1500, 1350, 1200, "Healthy"),
#     (100, 1, 500, 200, 198, 2, "Fake"),
#     (80, 70, 75, 70, 65, 60, "Healthy"),
#     (8000, 30, 40000, 15000, 14850, 60, "Fake"),
#     (1500, 1200, 1300, 1200, 1080, 1000, "Healthy"),
#     (3000, 15, 15000, 6000, 5940, 30, "Fake"),
#     (600, 500, 550, 500, 450, 400, "Healthy"),
#     (50, 1, 250, 100, 99, 1, "Fake"),
#     (40, 35, 38, 35, 32, 30, "Healthy"),
#     (700, 5, 3500, 1400, 1386, 7, "Fake"),
#     (250, 200, 220, 200, 180, 170, "Healthy")
# ]
#
# # Running the tests
# for i, (followers, engaged_followers, total_likes, vouchers_issued, vouchers_used, unique_voucher_users,
#         business_type) in enumerate(test_data):
#     rating_percentage = calculate_business_rating(
#         followers,
#         engaged_followers,
#         total_likes,
#         vouchers_issued,
#         vouchers_used,
#         unique_voucher_users
#     )
#     print(f"Test {i + 1}: Business Type = {business_type}, Rating = {rating_percentage:.2f}%")

"""
import math

def calculate_business_rating(
    followers,
    engaged_followers,
    total_likes,
    vouchers_issued,
    vouchers_used,
    unique_voucher_users,
    k=1,
    w_r=0.6,
    w_e1=0.25,
    w_e2=0.15,
    w_r1=0.4,
    w_r2=0.3,
    w_r3=0.3,
    max_r2=10  # Maximum expected average vouchers per customer
):
    # Validate weights sum to 1
    total_weight = w_r + w_e1 + w_e2
    if not abs(total_weight - 1.0) < 1e-6:
        raise ValueError("Weights w_r, w_e1, and w_e2 must sum up to 1.")

    total_r_weight = w_r1 + w_r2 + w_r3
    if not abs(total_r_weight - 1.0) < 1e-6:
        raise ValueError("Weights w_r1, w_r2, and w_r3 must sum up to 1.")

    # Prevent negative inputs
    if any(
        value < 0
        for value in [
            followers,
            engaged_followers,
            total_likes,
            vouchers_issued,
            vouchers_used,
            unique_voucher_users,
        ]
    ):
        raise ValueError("All input values must be non-negative.")

    # Voucher Redemption Rate (R1)
    R1 = vouchers_used / (vouchers_issued + k)

    # Average Vouchers per Customer (R2)
    avg_vouchers_per_customer = vouchers_used / (unique_voucher_users + k)

    # Normalize R2 using logarithmic scaling
    R2 = math.log(avg_vouchers_per_customer + 1) / math.log(max_r2 + 1)
    R2 = min(max(R2, 0), 1)

    # Unique Voucher User Ratio (R3)
    R3 = unique_voucher_users / (followers + k)
    R3 = min(max(R3, 0), 1)

    # Combined Voucher Usage Score (R)
    R = (w_r1 * R1) + (w_r2 * R2) + (w_r3 * R3)

    # Engagement Rate based on Engaged Followers (E1)
    E1 = engaged_followers / (followers + k)
    E1 = min(max(E1, 0), 1)

    # Engagement Rate from Likes (E2)
    E2 = total_likes / (followers + k)
    E2 = min(E2, 1.0)  # Cap E2 at 1

    # Calculate the overall rating
    rating = (w_r * R) + (w_e1 * E1) + (w_e2 * E2)

    # Convert to percentage
    rating_percentage = rating * 100

    return rating_percentage

# Test Cases Data (20 Tests)
test_data = [
    # (followers, engaged_followers, total_likes, vouchers_issued, vouchers_used, unique_voucher_users, type)
    (10000, 50, 50000, 20000, 19800, 100, "Fake"),
    (5000, 3500, 4000, 4000, 3200, 2800, "Healthy"),
    (1000, 10, 10000, 5000, 4950, 50, "Fake"),
    (800, 600, 700, 600, 540, 500, "Healthy"),
    (500, 5, 2000, 1000, 990, 10, "Fake"),
    (300, 250, 280, 250, 225, 200, "Healthy"),
    (200, 2, 1000, 500, 495, 5, "Fake"),
    (150, 120, 130, 120, 110, 100, "Healthy"),
    (5000, 20, 25000, 8000, 7920, 40, "Fake"),
    (2000, 1500, 1600, 1500, 1350, 1200, "Healthy"),
    (100, 1, 500, 200, 198, 2, "Fake"),
    (80, 70, 75, 70, 65, 60, "Healthy"),
    (8000, 30, 40000, 15000, 14850, 60, "Fake"),
    (1500, 1200, 1300, 1200, 1080, 1000, "Healthy"),
    (3000, 15, 15000, 6000, 5940, 30, "Fake"),
    (600, 500, 550, 500, 450, 400, "Healthy"),
    (50, 1, 250, 100, 99, 1, "Fake"),
    (40, 35, 38, 35, 32, 30, "Healthy"),
    (700, 5, 3500, 1400, 1386, 7, "Fake"),
    (250, 200, 220, 200, 180, 170, "Healthy")
]

# Running the tests
for i, (followers, engaged_followers, total_likes, vouchers_issued, vouchers_used, unique_voucher_users, business_type) in enumerate(test_data):
    rating_percentage = calculate_business_rating(
        followers,
        engaged_followers,
        total_likes,
        vouchers_issued,
        vouchers_used,
        unique_voucher_users
    )
    print(f"Test {i+1}: Business Type = {business_type}, Rating = {rating_percentage:.2f}%")
"""
