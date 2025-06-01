import CHECK from "../assets/stamps/check.svg";
import APPLE from "../assets/stamps/apple.svg";
import BEER from "../assets/stamps/beer.svg";
import BOWL from "../assets/stamps/bowl.svg";
import BURGER from "../assets/stamps/burger.svg";
import COFFEE from "../assets/stamps/coffee.svg";
import HOTDOG from "../assets/stamps/hotdog.svg";
import ICECREAM from "../assets/stamps/ice-cream.svg";
import PIZZA from "../assets/stamps/pizza.svg";
import SMILE from "../assets/stamps/smile.svg";
import STAR from "../assets/stamps/star.svg";

export const returnStamp = (color, stamp, size) => {
  switch (stamp) {
    case 1:
      return <CHECK width={size} height={size} fill={color} />;
    case 2:
      return <APPLE width={size} height={size} fill={color} />;
    case 3:
      return <BEER width={size} height={size} fill={color} />;
    case 4:
      return <BOWL width={size} height={size} fill={color} />;
    case 5:
      return <BURGER width={size} height={size} fill={color} />;
    case 6:
      return <COFFEE width={size} height={size} fill={color} />;
    case 7:
      return <HOTDOG width={size} height={size} fill={color} />;
    case 8:
      return <ICECREAM width={size} height={size} fill={color} />;
    case 9:
      return <PIZZA width={size} height={size} fill={color} />;
    case 10:
      return <SMILE width={size} height={size} fill={color} />;
    case 11:
      return <STAR width={size} height={size} fill={color} />;
  }
};
