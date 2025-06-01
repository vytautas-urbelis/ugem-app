import { View } from "react-native";
import { useEffect, useState } from "react";

import { authStorage } from "../../../MMKV/auth";
import { GetBusinessPromotionsForProfile } from "../../../axios/axiosCustomer/business";
import ActivePromotion from "./activePromotion";

const ActivePromotionsView = ({ businessProfile, businessId }) => {
  const [promotions, setPromotions] = useState([]);
  const [loader, setLoader] = useState(true);
  const accessToken = authStorage.getString("accessToken");

  useEffect(() => {
    setLoader(true);
    const fetchActivePromotions = async () => {
      try {
        const activePromotions = await GetBusinessPromotionsForProfile(businessId, accessToken);
        setPromotions(activePromotions);
      } catch (error) {
        console.log(error);
      } finally {
        setLoader(false);
      }
    };

    fetchActivePromotions();
  }, []);

  return (
    <View className="flex-1 items-center justify-start w-full">
      {promotions.length === 0 && !loader ? (
        <></>
      ) : (
        <View className="w-full">
          {promotions.map((promotion, index) => (
            <>
              {promotion.have_this_voucher ? (
                <></>
              ) : (
                <ActivePromotion
                  key={promotion.id}
                  businessProfile={businessProfile}
                  promotion={promotion}
                  promotions={promotions}
                  setPromotions={setPromotions}
                  index={index}></ActivePromotion>
              )}
            </>
          ))}
        </View>
      )}
    </View>
  );
};

export default ActivePromotionsView;
